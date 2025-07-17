const Price = require('../models/Price');

class InterpolationService {
    async interpolatePrice(token, network, targetTimestamp) {
        try {
            // Find the closest prices before and after the target timestamp
            const beforePrice = await Price.findOne({
                token,
                network,
                timestamp: { $lte: targetTimestamp }
            }).sort({ timestamp: -1 });

            const afterPrice = await Price.findOne({
                token,
                network,
                timestamp: { $gte: targetTimestamp }
            }).sort({ timestamp: 1 });

            if (!beforePrice && !afterPrice) {
                throw new Error('No price data available for interpolation');
            }

            // If we have exact match
            if (beforePrice && beforePrice.timestamp === targetTimestamp) {
                return {
                    price: beforePrice.price,
                    basedOn: { exact: true, timestamp: beforePrice.timestamp }
                };
            }

            // If we only have one side, use that price
            if (!beforePrice) {
                return {
                    price: afterPrice.price,
                    basedOn: { 
                        type: 'forward_fill',
                        from: { timestamp: afterPrice.timestamp, price: afterPrice.price }
                    }
                };
            }

            if (!afterPrice) {
                return {
                    price: beforePrice.price,
                    basedOn: { 
                        type: 'backward_fill',
                        from: { timestamp: beforePrice.timestamp, price: beforePrice.price }
                    }
                };
            }

            // Linear interpolation
            const timeDiff = afterPrice.timestamp - beforePrice.timestamp;
            const targetDiff = targetTimestamp - beforePrice.timestamp;
            const ratio = targetDiff / timeDiff;

            const interpolatedPrice = beforePrice.price + (afterPrice.price - beforePrice.price) * ratio;

            return {
                price: interpolatedPrice,
                basedOn: {
                    type: 'linear_interpolation',
                    before: { timestamp: beforePrice.timestamp, price: beforePrice.price },
                    after: { timestamp: afterPrice.timestamp, price: afterPrice.price },
                    ratio
                }
            };

        } catch (error) {
            console.error('❌ Interpolation error:', error);
            throw new Error('Price interpolation failed: ' + error.message);
        }
    }
}

module.exports = new InterpolationService();
