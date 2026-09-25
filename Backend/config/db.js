const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');
}

module.exports = connectDB;