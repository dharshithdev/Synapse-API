const { client, connectRedis } = require('../Config/Redis'); // 💡 Ensure 'client' matches your export name!
const Service = require('../Models/Service');

const rateLimiter = async (req, res, next) => {
    try {
        // 💡 Ensure Redis is completely alive and active before executing commands
        await connectRedis();

        // 💡 Parse out the cluster segment from the raw original URL string instead of req.params
        const originalUrl = req.originalUrl || '';
        const segments = originalUrl.split('?')[0].split('/').filter(Boolean);
        
        // Remove 'api' and 'v1' from the tracking sequence
        segments.shift(); // Removes 'api'
        segments.shift(); // Removes 'v1'
        
        // The first remaining piece is your cluster name keyword (e.g., 'hercare')
        const pathSegment = segments[0] || ''; 
        
        if (!pathSegment) {
            return res.status(400).json({ message: 'Bad Request: Target cluster segment missing from path lookup.' });
        }

        const frontendLookupPath = `/api/${pathSegment}`;
        const apiKey = req.headers['x-api-key'];

        if (!apiKey) {
            return res.status(401).json({ message: 'Access Denied: Header authorization footprint missing.' });
        }

        const cluster = await Service.findOne({ frontendPath: frontendLookupPath });

        if (!cluster) {
            return res.status(404).json({ message: `Routing Error: No configuration matching '${frontendLookupPath}'.` });
        }

        if (!cluster.isActive) {
            return res.status(503).json({ message: 'Cluster Offline: Administratively disabled.' });
        }

        if (cluster.apiKey !== apiKey) {
            return res.status(403).json({ message: 'Security Violation: Invalid credential signature verified.' });
        }

        // --- ATOMIC REDIS RATE LIMIT TRANSACTION ---
        const redisKey = `synapse:throttle:${apiKey}`;
        
        // ✅ FIXED: Changed from redisClient.incr to client.incr to match your top import!
        const currentRequests = await client.incr(redisKey);

        if (currentRequests === 1) {
            await client.expire(redisKey, 60); // ✅ FIXED: Changed from redisClient to client
        }

        if (currentRequests > cluster.rateLimit) {
            return res.status(429).json({ 
                message: `Rate Limit Exceeded: Cluster ceiling locked at ${cluster.rateLimit} RPM.` 
            });
        }

        req.clusterConfig = cluster;
        next();

    } catch (err) {
        console.error(`❌ Limiter verification fault: ${err.message}`);
        return res.status(500).json({ message: 'Internal Gateway throttle module collapse.', error: err.message });
    }
};

module.exports = rateLimiter;