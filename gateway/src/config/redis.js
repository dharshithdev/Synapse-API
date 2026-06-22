const { createClient } = require('redis');

// Initialize the Redis client using the Docker URL from your .env file
const redisClient = createClient({ 
    url: process.env.REDIS_URL
});

// Event listeners to track connection stability in your terminal
redisClient.on('error', (err) => console.error(' Redis Client Error:', err));
redisClient.on('connect', () => console.log(' Connected to Redis successfully!'));

const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch (error) {
        console.error('Failed to establish connection to Redis:', error);
        process.exit(1); // Kill process if core dependency fails
    }
};

module.exports = { redisClient, connectRedis };