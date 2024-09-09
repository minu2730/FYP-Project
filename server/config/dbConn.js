const mongoose = require("mongoose");
const dotenv = require('dotenv').config();

const dbConn = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, 
            socketTimeoutMS: 45000, 
        });
        mongoose.set('debug', true);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(`Mongoose connection error: ${err}`);
    }

    mongoose.connection.on('error', err => {
        console.error(`Mongoose connection error: ${err}`);
    });
};

module.exports = dbConn;
