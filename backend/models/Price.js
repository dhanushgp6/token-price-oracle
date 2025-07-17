const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        lowercase: true
    },
    network: {
        type: String,
        required: true,
        enum: ['ethereum', 'polygon']
    },
    timestamp: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true
    }
}, {
    timestamps: true // Adds createdAt, updatedAt
});

// Compound index for fast queries
priceSchema.index({ token: 1, network: 1, timestamp: 1 });

module.exports = mongoose.model('Price', priceSchema);
