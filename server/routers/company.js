const express = require('express');
const companyModel = require('../model/Company');
const Company = require('../model/Company');
const User = require('../model/User');
const Team = require('../model/Team');
const router = express.Router();

router.post('/addCompany', async (req, res) => {
	const { userId, name, companyWebsite, companyAddress } = req.body;

	const result = await Company.findOne({ userId: userId });
	if (result != null) {
		return res.status(400).json({ msg: 'Company already exists' });
	}

	let company = new Company({
		userId,
		name,
		website: companyWebsite,
		address: companyAddress,
	});
	company = await company.save();

	// set user type to company
	const user = await User.findById(userId);
	user.type = 'company';
	user.tocId = company._id;
	await user.save();

	return res.status(200).json({
		msg: 'Company created successfully',
	});
});

router.get('/getAllCompanies', async (req, res) => {
	try {
		// only send company id and name
		const companies = await companyModel.find({}, { name: 1, _id: 1 });
		res.status(200).json(companies);
	} catch (error) {
		res.status(500).json({ msg: 'An error occurred while fetching companies' });
	}
});

router.get('/getTeamsDetails/:id', async (req, res) => {
	try {
		const id = req.params.id;

		const company = await Company.findById(id);
		if (!company) {
			return res.status(400).json({ msg: 'Company not found' });
		}

		// find all users wher tocId = id && user.type !== 'company'
		const teams = await Team.find({ companyId: id }).populate({
			path: 'userId',
			model: 'user',
			select: 'name totalSale compensationLevel',
		});

		return res.status(200).json({ teams: teams });
	} catch (err) {
		res.status(500).send('Server Error');
	}
});

module.exports = router;
