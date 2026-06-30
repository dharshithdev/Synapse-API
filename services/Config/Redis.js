const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const isSecure = redisUrl.startsWith('rediss://');

const client = createClient({
  url: redisUrl,
  socket: isSecure ? {
    tls: true,
    rejectUnauthorized: false,
    keepAlive: 5000 // 💡 Keeps connection alive every 5 seconds
  } : {
    keepAlive: 5000
  }
});

client.on('error', (err) => {
  // Suppress repetitive logging during transient connection shifts
  if (err.message && err.message.includes('Socket closed unexpectedly')) return;
  console.error('❌ Redis Cache Cluster Node Error:', err);
});

client.on('ready', () => console.log('⚡ Redis Client connected and ready for queries!'));

const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
};

module.exports = { connectRedis, client };