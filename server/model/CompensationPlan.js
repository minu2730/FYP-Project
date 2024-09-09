const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
	generational: {
		type: Object,
		default: {
			manager: {
				type: Object,
				discount: 48,
				targetSale: 9999999999,
			},
			assistant_manager: {
				type: Object,
				discount: 43,
				targetSale: 120,
			},
			supervisor: {
				type: Object,
				discount: 38,
				targetSale: 75,
			},
			assistant_supervisor: {
				type: Object,
				discount: 30,
				targetSale: 25,
			},
			preferred_customer: {
				type: Object,
				discount: 5,
				targetSale: 2,
				lowestLevel: true,
			},
		},
	},
});

module.exports = mongoose.model('compensationPlan', planSchema);
