require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./services/database');
const redisService = require('./services/redis');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to databases
connectDB();
redisService.connect();

app.use(cors());
app.use(express.json());

// Import routes
const priceRoutes = require('./routes/price');
const scheduleRoutes = require('./routes/schedule');

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is working perfectly!',
        environment: process.env.NODE_ENV,
        mongodb: 'connected',
        redis: redisService.isConnected ? 'connected' : 'disconnected'
    });
});

// API routes
app.use('/api/price', priceRoutes);
app.use('/api/schedule', scheduleRoutes);

// 404 handler - FIXED
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        requestedPath: req.path,
        availableEndpoints: [
            'GET /health',
            'GET /api/price?token=<address>&network=<ethereum|polygon>&timestamp=<unix>',
            'POST /api/schedule {token, network}'
        ]
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`📋 Available endpoints:`);
    console.log(`   GET  /health`);
    console.log(`   GET  /api/price`);
    console.log(`   POST /api/schedule`);
});
