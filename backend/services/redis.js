const redis = require('redis');

class RedisService {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            this.client = redis.createClient({
                url: process.env.REDIS_URL || 'redis://localhost:6379'
            });

            this.client.on('error', (err) => {
                console.error('❌ Redis error:', err.message);
                this.isConnected = false;
            });

            this.client.on('connect', () => {
                console.log('📦 Redis connected successfully');
                this.isConnected = true;
            });

            await this.client.connect();
        } catch (error) {
            console.error('❌ Redis connection failed:', error.message);
            this.isConnected = false;
        }
    }

    async get(key) {
        if (!this.isConnected) return null;
        try {
            const result = await this.client.get(key);
            return result ? JSON.parse(result) : null;
        } catch (error) {
            console.error('❌ Redis GET error:', error);
            return null;
        }
    }

    async set(key, value, ttlSeconds = 300) { // 5 minutes default
        if (!this.isConnected) return false;
        try {
            await this.client.setEx(key, ttlSeconds, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('❌ Redis SET error:', error);
            return false;
        }
    }
}

module.exports = new RedisService();
