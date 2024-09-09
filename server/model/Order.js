const mongoose = require('mongoose');

const Order = new mongoose.Schema({
	buyer: String,
	items: [String],
	seller: String,
	paymentConfirmed: {
		type: Boolean,
		default: false
	},
  fullfilled: {
		type: Boolean,
		default: false
	},
});

module.exports = mongoose.model('Order', Order);
