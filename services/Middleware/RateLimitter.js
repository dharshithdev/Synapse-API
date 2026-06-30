// 1. Keep your import from your Config file
const { connectRedis } = require('../Config/Redis'); 
const Service = require('../Models/Service');

const rateLimiter = async (req, res, next) => {
    try {
        // 2. ✅ FIX: Capture the live, initialized client returned by the function!
        const redisClient = await connectRedis();

        const originalUrl = req.originalUrl || '';
        const segments = originalUrl.split('?')[0].split('/').filter(Boolean);
        
        segments.shift(); // Removes 'api'
        segments.shift(); // Removes 'v1'
        const pathSegment = segments[0] || ''; 
        
        if (!pathSegment) {
            return res.status(400).json({ message: 'Bad Request: Target cluster segment missing.' });
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

        const redisKey = `synapse:throttle:${apiKey}`;
        
        // 3. ✅ FIX: Use the 'redisClient' reference variable we just captured above
        const currentRequests = await redisClient.incr(redisKey);

        if (currentRequests === 1) {
            await redisClient.expire(redisKey, 60); 
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