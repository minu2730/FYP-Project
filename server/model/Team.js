const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
	userId: String,
	name: String,
	companyId: String,
	compensationPlan: [Object],
	members: [String],
});

module.exports = mongoose.model('team', teamSchema);
