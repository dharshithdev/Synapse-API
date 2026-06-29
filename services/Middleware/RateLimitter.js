const { redisClient, connectRedis } = require('../Config/Redis'); // 💡 Added connectRedis import
const Service = require('../Models/Service');

const rateLimiter = async (req, res, next) => {
    try {
        // 💡 Ensure Redis is completely alive and active before executing commands
        await connectRedis();

        const proxyPath = req.params.proxyPath;
        
        const pathSegment = Array.isArray(proxyPath) ? proxyPath[0] : (proxyPath || '').split('/').filter(Boolean)[0];
        
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