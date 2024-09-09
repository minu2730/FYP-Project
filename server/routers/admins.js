const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadFile = require("../utils/uploadFile");
const Team = require("../model/Team");
const Company = require("../model/Company");
const Product = require("../model/Product");
const CartItem = require("../model/CartItem");
const { findById } = require("../model/User");
const upload = multer();
const User = require("../model/User");

router.get("/userdetails/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Assuming getUserById is a function to fetch the user by ID
    const user = await User.findById(userId);

    if (!user) {
      // Return a 404 status if the user is not found
      return res.status(404).json({ message: "No user found!" });
    }

    // Return the user details with a 200 status
    res.status(200).json(user);
  } catch (error) {
    // Catch any unexpected errors and return a 500 status
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Unexpected error occurred", error });
  }
});

router.get("/getcompanydetails/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    console.log(userId);

    const companyDetails = await Company.find({ userId: userId });

    if (!companyDetails) {
      // Return a 404 status if the user is not found
      return res.status(404).json({ message: "No company found!" });
    }

    // Return the user details with a 200 status
    res.status(200).json(companyDetails);


    // to get company with team names instead to team ids
    // const userId = req.params.id;

    // console.log(userId);

    // // Fetch company details based on userId
    // const companyDetails = await Company.findOne({ userId: userId });

    // if (!companyDetails) {
    //   // Return a 404 status if no company is found
    //   return res.status(404).json({ message: "No company found!" });
    // }

    // // Extract the team array from companyDetails
    // const teamIds = companyDetails.team; // Assuming 'team' is an array of team IDs

    // // Find teams by IDs and select only the 'name' field
    // const teams = await Team.find({ _id: { $in: teamIds } }).select("name");

    // // Map the team names to the corresponding team IDs
    // const teamNames = teams.map(team => team.name);

    // // Replace the team IDs with team names in companyDetails
    // companyDetails.team = teamNames;

    // // Return the updated company details with team names
    // res.status(200).json(companyDetails);
  } catch (error) {
    console.error("Error fetching company details:", error);
    res.status(500).json({ message: "Unexpected error occurred", error });
  }
});

router.get("/teamdetails/:id", async (req, res) => {
  try {
    const teamId = req.params.id;

    console.log(teamId);

    const teamDetails = await Team.findOne({ userId: teamId });

    if (!teamDetails) {
      // Return a 404 status if the user is not found
      return res.status(404).json({ message: "No team found!" });
    }

    // Return the user details with a 200 status
    res.status(200).json(teamDetails);
  } catch (error) {
    console.error("Error fetching team details:", error);
    res.status(500).json({ message: "Unexpected error occurred", error });
  }
});

router.get("/totalteams", async (req, res) => {
  try {
    const teamCount = await Team.estimatedDocumentCount();

    console.log(teamCount);

    res.status(200).json(teamCount);
  } catch (error) {
    console.error("Error fetching team count:", error);
    res.status(500).json({ message: "Unexpected error occurred", error });
  }
});

router.delete("/deluser/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) {
      return "no user found";
    }

    await User.findByIdAndDelete(id);

    res.send("user deleted succexfuly");
  } catch (error) {
    console.error("Error deleting user", error);
    res.status(500).json({ message: "Unexpected error occurred", error });
  }
});

module.exports = router;
