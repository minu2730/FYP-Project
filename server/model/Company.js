const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
	userId: String,
	name: String,
	website: String,
	address: String,
	tutorials: [String],
	teams: [String],
	compensationPlanType: {
		type: String,
		default: 'generational',
	},
});

module.exports = mongoose.model('company', companySchema);
