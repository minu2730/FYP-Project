const mongoose = require('mongoose');

const VerificationCode = new mongoose.Schema({
	userId: String,
	code: Number,
});

module.exports = mongoose.model('verificationCode', VerificationCode);
