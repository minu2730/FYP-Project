const express = require('express');
const router = express.Router();
const CartItem = require('../model/CartItem');

router.post('/addToCart', async (req, res) => {
	try {
		const { userId, productId, quantity } = req.body;

		// find if product already exists in cart
		const product = await CartItem.findOne({ owner: userId, productId, ordered: false });

		if (product) {
			// if product exists, update quantity
			await CartItem.findOneAndUpdate(
				{ owner: userId, productId, ordered: false },
				{ quantity: Number(product.quantity) + Number(quantity) },
			);
		}

		// if product doesn't exist, add product to cart
		else {
			const cartItem = new CartItem({
				owner: userId,
				productId,
				quantity,
			});

			await cartItem.save();
		}

		res.status(200).json({ msg: 'Product added to cart' });
	} catch (err) {
		res.status(500).json({ msg: err.message });
	}
});

router.get('/', async (req, res) => {
	const { userId } = req.query;

	try {
		// Get items where owner = userId && ordered = false, with product details
		const cartItems = await CartItem.find({
			owner: userId,
			ordered: false,
		}).populate({
			path: 'productId',
			model: 'product', // Use the name of your Product model
		});

		res.status(200).json({ cartItems });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.delete('/removeFromCart', async (req, res) => {
	try{

		const { id } = req.query;
		
		await CartItem.findOneAndDelete({ _id: id });
		
		res.status(200).json({ msg: 'Product removed from cart' });
	} catch (err) {
		res.status(500).json({ msg: 'Error occurred, try again' });
	}
});

module.exports = router;


