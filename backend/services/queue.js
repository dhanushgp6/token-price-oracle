const alchemyService = require('./alchemy');
const Price = require('../models/Price');

class QueueService {
    constructor() {
        this.isEnabled = false;
        this.priceQueue = null;
        this.worker = null;
        
        // Don't initialize queue automatically
        console.log('⚠️  Queue system disabled (Redis version compatibility issue)');
    }

    generateDailyTimestamps(startDate, endDate) {
        const timestamps = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
            const noonUTC = new Date(d);
            noonUTC.setUTCHours(12, 0, 0, 0);
            timestamps.push(Math.floor(noonUTC.getTime() / 1000));
        }
        
        return timestamps;
    }

    async scheduleHistoryFetch(token, network) {
        // Always use fallback mode for now
        console.log(`⚠️  Queue disabled, simulating immediate processing for ${token}`);
        
        try {
            // Simulate background processing
            this.simulateHistoryFetch(token, network);
            return 'simulated-job-' + Date.now();
        } catch (error) {
            console.error('❌ Simulation error:', error);
            throw new Error('Failed to simulate history fetch');
        }
    }

    async simulateHistoryFetch(token, network) {
        // Run this in background (don't await)
        setTimeout(async () => {
            try {
                console.log(`🔄 Starting simulated history fetch for ${token} on ${network}`);
                
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 3); // Just 3 days for demo
                
                const timestamps = this.generateDailyTimestamps(startDate, endDate);
                
                for (const timestamp of timestamps) {
                    try {
                        const existing = await Price.findOne({
                            token: token.toLowerCase(),
                            network,
                            timestamp
                        });

                        if (!existing) {
                            const priceData = await alchemyService.getTokenPrice(token, network, timestamp);
                            
                            const newPrice = new Price({
                                token: token.toLowerCase(),
                                network,
                                timestamp,
                                price: priceData.price,
                                date: new Date(timestamp * 1000).toISOString().split('T')[0]
                            });
                            
                            await newPrice.save();
                            console.log(`✅ Simulated save: ${token} at ${timestamp} = $${priceData.price}`);
                        }

                        // Small delay between requests
                        await new Promise(resolve => setTimeout(resolve, 200));
                    } catch (error) {
                        console.error(`❌ Error in simulation for ${token} at ${timestamp}:`, error.message);
                    }
                }
                
                console.log(`🎉 Simulated history fetch completed for ${token}`);
            } catch (error) {
                console.error('❌ Simulation failed:', error.message);
            }
        }, 1000); // Start after 1 second
    }
}

module.exports = new QueueService();
