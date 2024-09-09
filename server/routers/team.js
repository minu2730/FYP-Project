const express = require("express");
const Team = require("../model/Team");
const Company = require("../model/Company");
const User = require("../model/User");
const router = express.Router();

router.post("/addTeam", async (req, res) => {
  try {
    const {
      userId,
      name,
      teamParentComany: companyId,
      compensationLevel,
    } = req.body;

    // find team based on name, if exists send resp telling "team already exists"
    let result = await Team.findOne({ name: name, companyId: companyId });
    if (result != null) {
      return res.status(400).json({ msg: "Team already exists" });
    }

    const team = await Team.findOne({ userId: userId });
    if (team !== null) {
      return res.status(400).json({ msg: "You already have a team" });
    }
    // if a user have a team, he can't create another team

    // create new team
    const newTeam = new Team({
      userId,
      name,
      companyId,
    });
    result = await newTeam.save();

    let company;

    if (companyId) {
      // add team to company
      company = await Company.findById(companyId);
      company.teams.push(result?._id);
      company = await company.save();
    }

    // update user type to "team"
    const user = await User.findById(userId);
    user.type = "team";
    user.teamId = result._id;
    console.log(compensationLevel, "***");
    user.compensationLevel = compensationLevel;

    if (companyId) {
      user.tocId = company._id;
    } else {
      user.tocId = result._id;
    }
    await user.save();

    // send response
    return res.status(200).json({
      msg: "Team created successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// get team details

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    const memberIds = user.members; // Assuming 'member' is the array of member IDs

    // Find the users whose _id is in the memberIds array
    const members = await User.find({ _id: { $in: memberIds } }).select(
      "_id name email compensationLevel"
    );

    return res.status(200).json({ teamMembers: members });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;
