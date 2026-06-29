const express = require('express');
const proxy = require('express-http-proxy');
const rateLimiter = require('../Middleware/RateLimitter');
const Analytics = require('../Models/Analytics');

const router = express.Router({ mergeParams: true });

router.all('/', rateLimiter, (req, res, next) => {
    const proxyPath = req.params.proxyPath;
    const { targetUrl, _id: serviceId } = req.clusterConfig;
    
    const startTime = Date.now(); 

    const segments = Array.isArray(proxyPath) ? [...proxyPath] : (proxyPath || '').split('/').filter(Boolean);
    segments.shift(); 
    const subPath = '/' + segments.join('/');

    return proxy(targetUrl, {
        proxyReqPathResolver: () => {
            return subPath + (req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '');
        },
        userResHeaderDecorator(headers) {
            headers['x-powered-by'] = 'Synapse Distributed Proxy Engine (Redis Layered)';
            return headers;
        },
        // Captures telemetry for successful requests passing through the target upstream server
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
});

module.exports = router;