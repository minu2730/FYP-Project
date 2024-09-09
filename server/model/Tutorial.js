const mongoose = require('mongoose');

const TutorialSchema = new mongoose.Schema({
	tocId: String,
	link: String
});

const Tutorial = mongoose.model('tutorial', TutorialSchema);

module.exports = Tutorial;
