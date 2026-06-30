const redis = require('redis');

let client;

const connectRedis = async () => {
    // 1. If no client exists, initialize it with a robust retry strategy
    if (!client) {
        client = redis.createClient({
            url: process.env.REDIS_URL, // e.g., rediss://default:... from Upstash
            socket: {
                reconnectStrategy: (retries) => {
                    console.log(`🔄 Redis reconnecting... attempt #${retries}`);
                    // Exponential backoff or max out at 3 seconds
                    return Math.min(retries * 100, 3000); 
                },
                connectTimeout: 10000
            }
        });

        client.on('error', (err) => console.error('❌ Redis Client Error:', err));
        client.on('connect', () => console.log('⚡ Connected to Upstash Redis Node'));
    }

    // 2. ✅ CRITICAL FIX: If the socket unexpectedly closed, explicitly reopen it
    if (!client.isOpen) {
        try {
            await client.connect();
        } catch (error) {
            console.error('❌ Failed to restore broken Redis socket:', error.message);
        }
    }

    return client;
};

// Make sure you export BOTH the wrapper and the instance cleanly
module.exports = { client, connectRedis };