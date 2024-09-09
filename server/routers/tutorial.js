const express = require('express');
const Tutorial = require('../model/Tutorial');
const router = express.Router();

router.post('/add', async (req, res) => {
	try {
		const { tocId, link } = req.body;

		const tutorial = new Tutorial({
			tocId,
			link,
		});

		await tutorial.save();

		res.status(200).json({ msg: 'Tutorial added successfully' });
	} catch (err) {
		res.status(500).json({ msg: 'Error occurred, try again!' });
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		
		await Tutorial.findByIdAndDelete(id);

		res.status(200).json({ msg: 'Tutorial deleted successfully' });
	} catch (err) {
		res.status(500).json({ msg: 'Error occurred, try again!' });
	}
});

router.get('/', async (req, res) => {
	try {
		const { tocId } = req.query;

		const tutorials = await Tutorial.find({ tocId }).select('link');

		if (!tutorials) {
			res.status(404).json({ msg: 'Payment details not found' });
		} else {
			res.status(200).json({ links: tutorials });
		}
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

module.exports = router;
