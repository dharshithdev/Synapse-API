const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
    // 💡 This forces the client to negotiate the TLS handshake correctly over rediss://
    tls: true,
    rejectUnauthorized: false // Necessary for many serverless cloud environments
  }
});

redisClient.on('error', (err) => console.error('❌ Redis Cache Cluster Node Error:', err));
redisClient.on('connect', () => console.log('⚡ Redis Client handshaking...'));
redisClient.on('ready', () => console.log('⚡ Redis Telemetry Throttler cache connected and ready.'));

const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch (err) {
        console.error('❌ Failed to establish initial Redis connection:', err.message);
    }
};  

module.exports = { redisClient, connectRedis };