const { redisClient } = require('../config/redis');

const rateLimiter = (maxRequests, windowSizeInSeconds) => {
    return async (req, res, next) => {
        // Use the client's IP address as the unique identifier key in Redis
        const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const redisKey = `rate-limit:${ip}`; 

        try {
            // Fetch the current number of requests this IP has made
            const requests = await redisClient.get(redisKey);

            if (requests === null) {
                // First request in this time window: Create the key and set expiration
                await redisClient.set(redisKey, 1, { EX: windowSizeInSeconds });
                return next();
            }

            const currentRequests = parseInt(requests, 10);

            if (currentRequests >= maxRequests) {
                // Limit exceeded! Block the request
                return res.status(429).json({
                    error: 'Too Many Requests',
                    message: `You have exceeded your limit of ${maxRequests} requests per ${windowSizeInSeconds} seconds. Please slow down!`,
                    retryAfterSeconds: await redisClient.ttl(redisKey) // Tells them exactly how long to wait
                });
            }

            // Still within the limit: increment the count in Redis
            await redisClient.incr(redisKey);
            next();

        } catch (error) {
            console.error('Rate Limiter Error:', error);
            // Fail-safe: If Redis goes down, we still let traffic pass so the app doesn't break
            next();
        }
    };
};

module.exports = rateLimiter;