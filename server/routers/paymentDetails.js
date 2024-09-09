const express = require('express');
const router = express.Router();
const PaymentDetails = require('../model/PaymentDetails');

router.post('/add', async (req, res) => {
	try {
		const { tocId, bankName, accountNumber, accountName } = req.body;

		const pd = await PaymentDetails.findOne({ tocId });
		if (!pd) {
			const paymentDetails = new PaymentDetails({
				tocId,
				bankName,
				accountNumber,
				accountName,
			});

			await paymentDetails.save();

			res.status(200).json({ msg: 'Payment details added' });
		} else {
			// update details
			pd.bankName = bankName;
			pd.accountNumber = accountNumber;
			pd.accountName = accountName;

			await pd.save();

			res.status(200).json({ msg: 'Payment details updated' });
		}
	} catch (err) {
		res.status(500).json({ msg: 'Error occurred, try again!' });
	}
});

router.get('/', async (req, res) => {
	try {
		const { tocId } = req.query;

		const pd = await PaymentDetails.findOne({ tocId });

		if (!pd) {
			res.status(404).json({ msg: 'Payment details not found' });
		} else {
			res.status(200).json({ paymentDetails: pd });
		}
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

module.exports = router;
