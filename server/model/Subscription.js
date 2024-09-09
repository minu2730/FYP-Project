const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
	userId: String,
	details: String,
	price: Number,
	active: {
		type: Boolean,
		default: true,
	},
});

const Subscription = mongoose.model('subscription', SubscriptionSchema);

module.exports = Subscription;
