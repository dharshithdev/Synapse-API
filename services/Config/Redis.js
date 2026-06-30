const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const isSecure = redisUrl.startsWith('rediss://');

const client = createClient({
  url: redisUrl,
  socket: isSecure ? {
    tls: true,
    rejectUnauthorized: false
  } : {}
});

client.on('error', (err) => console.error('❌ Redis Cache Cluster Node Error:', err));
client.on('connect', () => console.log('⚡ Redis Client connected successfully!'));

// 💡 Wrap the connection command inside an explicit async function
const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
};

// Export both the startup function and the client instance for queries
module.exports = { connectRedis, client };