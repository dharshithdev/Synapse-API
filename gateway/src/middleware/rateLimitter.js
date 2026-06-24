const { redisClient } = require('../config/redis');

// Refactored to act as a direct functional checker rather than a factory wrapper
const checkRateLimit = async (req, windowSizeInSeconds, maxRequests) => {
    // 1. Resolve unique IP tracking key
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const redisKey = `rate-limit:${ip}`; 

    try {
        const requests = await redisClient.get(redisKey);

        if (requests === null) {
            // First hit: Initialize token bucket in Redis with TTL window
            await redisClient.set(redisKey, 1, { EX: windowSizeInSeconds });
            return false; // NOT rate limited
        }

        const currentRequests = parseInt(requests, 10);

        if (currentRequests >= maxRequests) {
            return true; // YES, rate limited! Block them.
        }

        // Increment access counter safely
        await redisClient.incr(redisKey);
        return false; // NOT rate limited

    } catch (error) {
        console.error('Rate Limiter Engine Error:', error);
        return false; // Fail-safe fallback: let traffic pass if Redis behaves unexpectedly
    }
};

module.exports = { checkRateLimit };