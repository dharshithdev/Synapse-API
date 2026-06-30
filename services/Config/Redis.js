const redis = require('redis');

let client;

const connectRedis = async () => {
    if (!client) {
        client = redis.createClient({
            url: process.env.REDIS_URL, 
            socket: {
                // ✅ CRITICAL CLOUD FIX: Enforce TLS configuration for Upstash
                tls: {}, 
                reconnectStrategy: (retries) => {
                    // Cap retries so it doesn't spin infinitely out of control
                    if (retries > 10) {
                        console.error('❌ Redis Reconnection limit breached. Halting retry logic.');
                        return false; 
                    }
                    console.log(`🔄 Redis reconnecting... attempt #${retries}`);
                    return Math.min(retries * 200, 3000); 
                },
                connectTimeout: 10000
            }
        });

        client.on('error', (err) => console.error('❌ Redis Client Error:', err.message));
        client.on('connect', () => console.log('⚡ Connected to Upstash Redis Node'));
    }

    if (!client.isOpen) {
        try {
            await client.connect();
        } catch (error) {
            console.error('❌ Failed to restore broken Redis socket:', error.message);
        }
    }

    return client;
};

module.exports = { client, connectRedis };