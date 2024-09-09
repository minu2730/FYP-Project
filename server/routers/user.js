const express = require("express");
const User = require("../model/User");
const Team = require("../model/Team");
const Company = require("../model/Company");
const CompensationPlan = require("../model/CompensationPlan");
const router = express.Router();
const bcrypt =  require("bcryptjs")


router.post("/addDownLine", async (req, res) => {
  const { name, email, sponserId, tocId, teamId, compensationLevel } = req.body;

  try {
    // Check if sponsor exists
    const sponser = await User.findById(sponserId);
    if (!sponser) {
      return res.status(400).json({ msg: "Sponsor does not exist" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "This Email is already registered" });
    }

    const pass = email;
    const salt = await bcrypt.genSalt(5);
    const hashedPassword = await bcrypt.hash(pass, salt);
    // Create new user
    const user = new User({
      name,
      email,
      upline: sponserId,
      tocId,
      teamId,
      compensationLevel,
      isVerified: true,
      type: "team",
      password: hashedPassword, // Consider hashing this password
    });
    await user.save();

    // Add user to sponsor's members list
    sponser.members.push(user._id);
    await sponser.save();

    // Add user to the team, if teamId is provided
    if (teamId) {
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(400).json({ msg: "Team does not exist" });
      }
      team.members.push(user._id);
      await team.save();
    }

    res.json({ msg: "Added downline" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/getCompansationLevels", async (req, res) => {
  const { tocId } = req.query;

  let tocUser = await Team.findById(tocId);

  if (!tocUser) {
    tocUser = await Company.findById(tocId);
  }

  if (!tocUser) {
    return res.status(400).json({ msg: "User not found" });
  }

  if (!tocUser) {
    return res.status(400).json({ msg: "User not found" });
  }

  let compPlan = await CompensationPlan.find();

  if (compPlan) {
    compPlan = compPlan[0][tocUser?.compensationPlanType];
    return res.json({ levels: compPlan ? Object?.keys(compPlan) : [] });
  }

  res.json({ levels: [] });
});

router.get("/", async (req, res) => {
  try {
    // get all users, only select name, email, type, and populate subscriptionId

    const users = await User.find({ isAdmin: false, isVerified: true })
      .select("name email type subscriptionId")
      .populate({
        path: "subscriptionId",
        model: "subscription",
        select: "details price active",
      });

    res.json({ users: users });
  } catch (err) {
    console.log(err)
    res.status(500).send("Server Error");
  }
});

module.exports = router;
