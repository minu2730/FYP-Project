const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	name: String,
	email: String,
	password: String,
	isVerified: { type: Boolean, default: false },
	type: { type: String, default: 'member' },
	compensationLevel: { type: String, default: '' },
	upline: String,
	members: [String],
	tocId: String,
	teamId: String,
	totalSale: { type: Number, default: 0 },
	personalIncome: { type: Number, default: 0 },
	downlineIncome: { type: Number, default: 0 },
	isAdmin: { type: Boolean, default: false },
	subscriptionId: String,
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
