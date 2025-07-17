const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/token-oracle');
        console.log('📦 MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        // Don't exit process, just log the error
        console.log('⚠️  Continuing without MongoDB...');
    }
};

module.exports = connectDB;
