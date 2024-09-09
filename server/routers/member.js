const express = require('express');
const User = require('../model/User');
const Member = require('../model/Member');
const router = express.Router();
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Team = require('../model/Team');
const CompensationPlan = require('../model/CompensationPlan');
const Company = require('../model/Company');
const VerificationCode = require('../model/VerificationCode');
const sendVerificationEmail = require('../utils/sendVerificationEmail');

router.post('/addMember', async (req, res) => {
	const {
		name,
		email,
		password,
		idCardNum,
		address,
		phoneNum,
		sponserId,
		tocId,
		teamId,
	} = req.body;

	// Check if the user already exists
	let user = await User.findOne({ email });

	if (user) {
		return res.status(400).json({ msg: 'User already exists' });
	}

	let sponser;
	if (sponserId) {
		sponser = await User.findById(sponserId);
		if (!sponser) {
			return res.status(400).json({ msg: 'Sponser not found!' });
		}
	}

	// Hash the password
	const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
	const salt = await bcrypt.genSalt(saltRounds);
	const hashedPassword = await bcrypt.hash(password, salt);

	const compensationLevel = await getLowestCompansationLevel(tocId);
	// Create a new user
	user = new User({
		name,
		email,
		password: hashedPassword,
		upline: sponserId,
		compensationLevel: compensationLevel,
		tocId: tocId,
		teamId: teamId,
	});
	await user.save();

	if (user) {
		const newMember = new Member({
			userId: user._id,
			idCardNum,
			address,
			phoneNum,
		});
		await newMember.save();

		if (sponser && sponserId) {
			sponser.members.push(user._id);
			await sponser.save();
		}
	}

	if (!teamId) {
		const team = await Team.findById(teamId);
		team?.members.push(user._id);
		await team.save();
	}

	// Create a new VerificationCode in table
	const verificationCode = Math.floor(100000 + Math.random() * 900000);
	const verificationCodeEntry = new VerificationCode({
		userId: user._id,
		code: verificationCode,
	});
	await verificationCodeEntry.save();

	sendVerificationEmail(user.email, verificationCodeEntry.code);

	return res.json({
		msg: 'verification code sent to your email.',
		user: {
			_id: user._id,
		},
	});
});

const getLowestCompansationLevel = async (tocId) => {
	let tocUser = await Team.findById(tocId);

	if (!tocUser) {
		tocUser = await Company.findById(tocId);

		if (!tocUser) {
			return res.status(400).json({ msg: 'User not found' });
		}

		if (!tocUser) {
			return res.status(400).json({ msg: 'User not found' });
		}

		let compPlan = await CompensationPlan.find();
		compPlan = compPlan[0][tocUser?.compensationPlanType];

		if (compPlan) {
			let lowestLevelName = null;

			for (const [position, details] of Object.entries(compPlan)) {
				if (details.lowestLevel) {
					lowestLevelName = position;
					break;
				}
			}

			return lowestLevelName;
		}
	}
};

module.exports = router;
