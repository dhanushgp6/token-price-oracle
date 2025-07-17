const express = require('express');
const router = express.Router();
const Price = require('../models/Price');
const alchemyService = require('../services/alchemy');
const interpolationService = require('../services/interpolation');
const redisService = require('../services/redis');

router.get('/', async (req, res) => {
    try {
        const { token, network, timestamp } = req.query;
        
        if (!token || !network || !timestamp) {
            return res.status(400).json({
                error: 'Missing required parameters: token, network, timestamp'
            });
        }

        const timestampNum = parseInt(timestamp);
        const cacheKey = `price:${token.toLowerCase()}:${network}:${timestampNum}`;

        // 1. Check Redis cache first
        const cachedPrice = await redisService.get(cacheKey);
        if (cachedPrice) {
            return res.json({
                ...cachedPrice,
                source: 'cache'
            });
        }

        // 2. Check database
        let existingPrice = await Price.findOne({
            token: token.toLowerCase(),
            network,
            timestamp: timestampNum
        });

        if (existingPrice) {
            const result = {
                price: existingPrice.price,
                source: 'database',
                token,
                network,
                timestamp: timestampNum
            };
            
            // Cache the result
            await redisService.set(cacheKey, result);
            return res.json(result);
        }

        // 3. Try Alchemy API
        try {
            const alchemyResult = await alchemyService.getTokenPrice(token, network, timestampNum);
            
            // Save to database
            const newPrice = new Price({
                token: token.toLowerCase(),
                network,
                timestamp: timestampNum,
                price: alchemyResult.price,
                date: new Date(timestampNum * 1000).toISOString().split('T')[0]
            });
            await newPrice.save();

            const result = {
                price: alchemyResult.price,
                source: 'alchemy',
                token,
                network,
                timestamp: timestampNum
            };

            // Cache the result
            await redisService.set(cacheKey, result);
            return res.json(result);
        } catch (alchemyError) {
            console.log('Alchemy failed, trying interpolation...');
        }

        // 4. Try interpolation
        const interpolated = await interpolationService.interpolatePrice(token.toLowerCase(), network, timestampNum);
        
        const result = {
            price: interpolated.price,
            source: 'interpolated',
            token,
            network,
            timestamp: timestampNum,
            interpolationData: interpolated.basedOn
        };

        // Cache interpolated result
        await redisService.set(cacheKey, result);
        res.json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
