const User = require("../model/User");
var bcrypt = require('bcryptjs');

const seedAdmin = async () => {
	try {
		const user = await User.findOne({
			isAdmin: true,
		});

		if (!user){

			await User.deleteMany({
				isAdmin: true,
			});
		}

		const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
		const salt = await bcrypt.genSalt(saltRounds);
		const hashedPassword = await bcrypt.hash('admin@mlmmanagement.com', salt);

		await User.create({
			name: 'Admin',
			email: 'admin@mlmmanagement.com',
			isAdmin: true,
			isVerified: true,
			password: hashedPassword,
		});

		console.log('Admin created successfully!');
	} catch (error) {
		console.log(error);
	}
};

module.exports = seedAdmin;
