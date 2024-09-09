const express = require('express');
const router = express.Router();
const Subscription = require('../model/Subscription');
const User = require('../model/User');

router.post('/add', async (req, res) => {
	try {
		const { details, price, userId } = req.body;

		const sub = await Subscription.findOne({ userId });
		if (!sub) {
			const newSub = new Subscription({
				details,
				price,
				userId,
			});

			await newSub.save();

			// add subscription to user

			await User.findByIdAndUpdate(userId, {
				subscriptionId: newSub._id,
			});

			res.status(200).json({ msg: 'Subscription added' });
		} else {
			// update details
			sub.details = details;
			sub.price = price;
			sub.active = true;

			await sub.save();

			res.status(200).json({ msg: 'Subscription details updated' });
		}
	} catch (err) {
		res.status(500).json({ msg: 'Error occurred, try again!' });
	}
});

// cancel sub
router.put('/cancel', async (req, res) => {
	try {
		const { userId } = req.body;

		const sub = await Subscription.findOne({ userId });
		if (!sub) {
			return res.status(400).json({ msg: 'Subscription not found' });
		}

		sub.active = false;
		sub.price = 0;
		await sub.save();

		res.status(200).json({ msg: 'Subscription cancelled' });
	} catch (err) {
		res.status(500).json({ msg: 'Error occurred, try again!' });
	}
});

module.exports = router;
