const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Team = require("../model/Team");
const Company = require("../model/Company");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const VerificationCode = require("../model/VerificationCode");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const sendEmail = require("../utils/mailer");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Create a new VerificationCode in table
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const verificationCodeEntry = new VerificationCode({
      userId: user._id,
      code: verificationCode,
    });
    await verificationCodeEntry.save();

    sendVerificationEmail(user.email, verificationCodeEntry.code);

    return res.json({
      user: {
        _id: user._id,
      },
      msg: "Verification code sent to you email!",
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error", error: err });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  try {
    const { email, password, type } = req.body;

    // Check if the user exists
    let user = await User.findOne({ email, type });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!user.isVerified) {
      // Create a new VerificationCode in table
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      // find the verification code entry, if exists then update the code, else create a new entry
      const codeEntry = await VerificationCode.findOne({ userId: user._id });

      if (codeEntry) {
        codeEntry.code = verificationCode;
        await codeEntry.save();
        sendVerificationEmail(user.email, codeEntry.code);
      } else {
        const verificationCodeEntry = new VerificationCode({
          userId: user._id,
          code: verificationCode,
        });
        await verificationCodeEntry.save();
        sendVerificationEmail(user.email, codeEntry.code);
      }
      return res.status(409).json({
        msg: "Account not verified, verification code sent to your email.",
        user: {
          _id: user._id,
        },
      });
    }

    // Generate a JWT token
    const token = jwt.sign({ user: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    res.json({
      token,
      user: {
        _id: user._id,
      },
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "Server Error" });
  }
});

// router.put("/verifyAccount", async (req, res) => {
//   const { userId, verificationCode } = req.body;

//   const code = await VerificationCode({ userId, code: verificationCode });

//   if (!code) {
//     return res.status(400).json({ msg: "Invalid verification code" });
//   }

//   const user = await User.findByIdAndUpdate(userId, { isVerified: true });

//   await VerificationCode.findByIdAndDelete(code._id);

//   // Generate a JWT token
//   const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRY,
//   });
//   return res.json({
//     token,
//     user: {
//       _id: user._id,
//     },
//     msg: "Account verified successfully",
//   });
// });

router.put("/verifyAccount", async (req, res) => {
  const { userId, verificationCode } = req.body;

  try {
    // Find the verification code by userId and code
    const code = await VerificationCode.findOne({
      userId,
      code: verificationCode,
    });

    if (!code) {
      return res.status(400).json({ msg: "Invalid verification code" });
    }

    // Find the user by ID and update the isVerified field
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    // Delete the verification code
    await VerificationCode.findByIdAndDelete(code._id);

    // Generate a JWT token
    const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    return res.json({
      token,
      user: {
        _id: user._id,
      },
      msg: "Account verified successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

router.post("/forget-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const verifiedUser = await User.findOne({ email });
    if (!verifiedUser) {
      return res.status(400).json({ msg: "Invalid Email" });
    }

    // Generate a JWT token
    const token = jwt.sign({ user: verifiedUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.RESET_JWT_EXPIRY,
    });

    // Send the password reset email
    const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    const message = ` <div style="margin: auto;border-radius:10px; padding: 50px 20px; font-size: 110%; text-align: center; font-family: 'Poppins', sans-serif; color: #ffffff; background: black;">
    <h2 style="color: white;font-size:2.2rem">Welcome to the MLM management System </h2>
    <p  style="color: orange;font-size:1rem">
        Click the button below to reset your password.
    </p>
    
    <a href=${link} style="background: orange; border-radius: 10px; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">RESET PASSWORD!</a>

    <p style="color: white;font-size:1rem">If the button doesn't work for any reason, you can also click on the link below:</p>

    <div>${link}</div>
    </div>`;

    sendEmail({
      to: verifiedUser.email,
      subject: "Password Reset",
      html: message,
    });

    res.status(200).json({ msg: "Password reset email sent" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "FORGOT PASSWORD PROCESS FAILED!!" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    // Check if the token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({ msg: "Invalid token" });
    }

    // Hash the password
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the password
    await User.findByIdAndUpdate(decoded.user, { password: hashedPassword });
    res.status(200).json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get the logged in user
router.get("/me", async (req, res) => {
  // console.log(req)
  try {
    const user = await User.findById(req.user).select("-password").populate({
      path: "subscriptionId",
      model: "subscription",
      select: "active",
    });

    console.log(user);

    let additionalData;

    if (user.type === "team") {
      additionalData = await Team.findOne({ userId: user._id });
      if (additionalData) {
        additionalData = {
          _id: additionalData._id,
          name: additionalData.name,
          companyId: additionalData.companyId,
          members: additionalData.members,
        };
      } else {
        additionalData = {};
      }
    } else if (user.type === "company") {
      additionalData = await Company.findOne({ userId: user._id });
      additionalData = {
        _id: additionalData._id,
        name: additionalData.name,
        teams: additionalData.teams,
      };
    }

    return res.json({ user: { ...user._doc, additionalData } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
