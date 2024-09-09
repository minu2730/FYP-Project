const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
	owner: String,
	productId: String,
	quantity: Number,
  ordered: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('CartItem', cartItemSchema);
