const express = require('express');
const proxy = require('express-http-proxy');
const rateLimiter = require('../Middleware/RateLimitter');
const Analytics = require('../Models/Analytics');

const router = express.Router({ mergeParams: true });

// ✅ FIXED: Using .use() catches all nested subpaths without triggering path-to-regexp errors!
router.use([rateLimiter, (req, res, next) => {
    const originalUrl = req.originalUrl; 
    const { targetUrl, _id: serviceId } = req.clusterConfig;
    
    const startTime = Date.now(); 

    // Extract everything after "/api/v1" safely
    const segments = originalUrl.split('?')[0].split('/').filter(Boolean);
    
    // Remove "api" and "v1"
    segments.shift(); // removes 'api'
    segments.shift(); // removes 'v1'
    
    // Remove the gateway mapping alias keyword (e.g., 'hercare')
    segments.shift(); 
    
    // Reconstruct the real target downstream subpath
    const subPath = '/' + segments.join('/'); // Yields: '/api/users/login'

    return proxy(targetUrl, {
        proxyReqPathResolver: () => {
            return subPath + (req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '');
        },
        userResHeaderDecorator(headers) {
            headers['x-powered-by'] = 'Synapse Distributed Proxy Engine (Redis Layered)';
            return headers;
        },
        userResDecorator: async (proxyRes, proxyResData, userReq, userRes) => {
            try {
                const responseTime = Date.now() - startTime;

                await Analytics.create({
                    serviceId,
                    path: userReq.originalUrl,
                    method: userReq.method,
                    statusCode: proxyRes.statusCode,
                    responseTime
                });
            } catch (err) {
                console.error('❌ Telemetry logging exception:', err.message);
            }
            return proxyResData;
        }
    })(req, res, next);
}]);

module.exports = router;