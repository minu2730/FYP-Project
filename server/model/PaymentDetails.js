const mongoose = require('mongoose');

const PaymentDetailsSchema = new mongoose.Schema({
	tocId: String,
	bankName: String,
	accountNumber: String,
	accountName: String,
});

const PaymentDetails = mongoose.model('paymentDetails', PaymentDetailsSchema);

module.exports = PaymentDetails;
