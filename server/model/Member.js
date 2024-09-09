const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
	userId: String,
	address: String,
	idCardNum: String,
	phoneNum: String,
});

const Member = mongoose.model('Member', MemberSchema);

module.exports = Member;