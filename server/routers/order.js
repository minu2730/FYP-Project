const express = require('express');
const router = express.Router();
const Product = require('../model/Product');
const CartItem = require('../model/CartItem');
const Order = require('../model/Order');
const User = require('../model/User');
const Team = require('../model/Team');
const Company = require('../model/Company');
const CompensationPlan = require('../model/CompensationPlan');

router.post('/newOrder', async (req, res) => {
	try {
		const { items, buyer, seller } = req.body;
		let cartItems = await CartItem.find({
			owner: buyer,
			_id: { $in: items },
			order: false,
		});

		if (!cartItems) {
			return res.status(400).json({ msg: 'Cart is empty' });
		}

		cartItems = await CartItem.updateMany(
			{ owner: buyer, _id: { $in: items } },
			{ ordered: true },
		);

		if (cartItems) {
			const order = new Order({
				buyer,
				items,
				seller,
			});

			await order.save();
			res.status(200).json({ msg: 'Order placed' });
		} else {
			res.status(400).json({ msg: 'Error occurred, try again!' });
		}
	} catch (err) {
		res.status(500).json({ msg: 'Error occurred, try again!' });
	}
});

const config = {
	user: {
		select: 'name compensationLevel',
	},
	team: {
		select: '_id',
		populate: {
			path: 'userId',
			model: 'user',
			select: 'name compensationLevel type',
		},
	},
	company: {
		select: '_id',
		populate: {
			path: 'userId',
			model: 'user',
			select: 'name compensationLevel type',
		},
	},
};

router.get('/', async (req, res) => {
	const { userId, accessor, sellerType, buyerType } = req.query;

	try {
		const orders = await Order.find({
			[accessor]: userId,
		})
			.populate({
				path: 'buyer',
				model: buyerType,
				...config[buyerType],
			})
			.populate({
				path: 'seller',
				model: [sellerType],
				...config[sellerType],
			})
			.populate({
				path: 'items',
				model: 'CartItem',
				populate: {
					path: 'productId',
					model: 'product',
					select: 'points',
				},
			});

		const transformedData = orders.map(async (order) => {
			const totalPoints = order.items.reduce((acc, item) => {
				const itemTotal = item.productId.points * item.quantity;
				return acc + itemTotal;
			}, 0);

			if (order.buyer === null) {
				const byr = await Order.findById(order._id).populate({
					path: 'buyer',
					model: 'user',
					select: 'name compensationLevel type',
				});

				const transformedOrder = {
					_id: order._id,
					buyer: byr.buyer?.name,
					buyerCompensationLevel: byr.buyer.compensationLevel,
					buyerType: byr.buyer.type,
					seller: order.seller.userId.name,
					sellerCompensationLevel: order.seller.userId?.compensationLevel,
					sellerType: order.seller.userId?.type,
					paymentConfirmed: order.paymentConfirmed,
					fullfilled: order.fullfilled,
					totalPoints: totalPoints,
				};

				return transformedOrder;
			}

			const transformedOrder = {
				_id: order._id,
				buyer: order?.buyer?.userId?.name || order.buyer?.name,
				buyerCompensationLevel:
					order.buyer?.userId?.compensationLevel ||
					order?.buyer?.compensationLevel,
				buyerType: order.buyer?.userId?.type || order.buyer?.type,
				seller: order.seller.userId.name,
				sellerCompensationLevel: order.seller.userId?.compensationLevel,
				sellerType: order.seller.userId?.type,
				paymentConfirmed: order.paymentConfirmed,
				fullfilled: order.fullfilled,
				totalPoints: totalPoints,
			};

			return transformedOrder;
		});
		const data = await Promise.all(transformedData);

		res.json({ orders: data });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const order = await Order.findById(id).populate({
			path: 'items',
			model: 'CartItem',
			populate: {
				path: 'productId',
				model: 'product',
			},
		});

		res.json({ items: order.items });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

const getRespectiveLevelGenerational = (plan, sale) => {
	const sortedData = Object.entries(plan).sort(
		(a, b) => a[1].targetSale - b[1].targetSale,
	);

	let level = null;

	for (const [position, details] of sortedData) {
		if (sale < details.targetSale) {
			level = position;
			break;
		}
	}

	return level;
};

const addRevenueToUplinesGenerational = async (
	res,
	userLevel,
	upline,
	points,
	compensationPlan,
) => {
	const uplineUser = await User.findById(upline);

	if (userLevel !== uplineUser.compensationLevel) {
		const percentage =
			compensationPlan[uplineUser.compensationLevel].discount -
			compensationPlan[userLevel].discount;
	
		uplineUser.downlineIncome =
			uplineUser.downlineIncome + (points * percentage) / 100;
		uplineUser.totalSale += points;
		uplineUser.compensationLevel = getRespectiveLevelGenerational(
			compensationPlan,
			uplineUser.totalSale,
		);
	
		await uplineUser.save();
	}


	if (!uplineUser.upline) {
		return;
	}

	await addRevenueToUplinesGenerational(
		res,
		uplineUser.compensationLevel,
		uplineUser.upline,
		points,
		compensationPlan,
	);
};

router.put('/fullfill/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const { points } = req.body;

		const order = await Order.findByIdAndUpdate(
			id,
			{ fullfilled: true },
			{ new: true },
		);

		if (!order) {
			return res.status(400).json({ msg: 'Order not found' });
		}

		let user = await User.findById(order.buyer);

		if (!user) {
			user = await Team.findById(order.buyer);

			if (!user) {
				user = await Company.findById(order.buyer);
			}

			if (user) {
				user = await User.findById(user.userId);
			}
		}

		if (!user) {
			return res.status(400).json({ msg: 'User not found' });
		}

		// let upline = await User.findById(user.upline);

		let compPlanOwner = await Team.findById(user.tocId);

		if (!compPlanOwner) {
			compPlanOwner = await Company.findById(user.tocId);
		}
		let compPlan;

		if (compPlanOwner) {
			compPlan = await CompensationPlan.find();
			compPlan = compPlan[0][compPlanOwner.compensationPlanType];

			user.totalSale += points;
			user.personalIncome +=
				(points * compPlan[user.compensationLevel].discount) / 100;

			user.compensationLevel = getRespectiveLevelGenerational(
				compPlan,
				user.totalSale,
			);
			console.log(
				'\n\n+++++++++++++',
				compPlanOwner,
				'\n\n++++++',
				compPlan,
				'\n\n++++++',
				user,
				'\n\n++++++',
			);
			user.save();

			compPlanOwner = await User.findById(compPlanOwner.userId);
		}
		if (user.upline) {
			if (compPlanOwner) {
				if (compPlan) {
					await addRevenueToUplinesGenerational(
						res,
						user.compensationLevel,
						user.upline,
						points,
						compPlan,
					);
					res.status(200).json({ msg: 'Order fullfilled' });
				}
			}
		} else {
			res.status(200).json({ msg: 'Order fullfilled' });
		}
	} catch (err) {
		res.status(500).json({ msg: 'Error occurred, try again!' });
	}
});

router.put('/confirmPayment/:id', async (req, res) => {
	try {
		const { id } = req.params;

		const order = await Order.findByIdAndUpdate(
			id,
			{ paymentConfirmed: true },
			{ new: true },
		);

		if (!order) {
			return res.status(400).json({ msg: 'Order not found' });
		}

		res.status(200).json({ msg: 'Order payment confirmed' });
	} catch (err) {
		res.status(500).json({ msg: 'Error occurred, try again!' });
	}
});

module.exports = router;
