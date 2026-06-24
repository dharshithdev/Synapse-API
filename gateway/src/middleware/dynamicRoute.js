const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const Service = require('../models/Service');
const authGuard = require('./authGuard');
// Import your rate limiter logic (adjust this path to match your actual checkRateLimit file)
const { checkRateLimit } = require('./rateLimitter'); 

const dynamicRouter = async (req, res, next) => {
    try {
        const services = await Service.find({ isActive: true });
        const fullPath = `/api${req.url}`.trim().toLowerCase();

        // 1. Match incoming path with database configurations
        const serviceConfig = services.find(service => {
            if (!service.apiPrefix) return false;
            return fullPath.startsWith(service.apiPrefix.trim().toLowerCase());
        });

        if (!serviceConfig) {
            console.log(`⚠️ No registered service matches prefix for: ${fullPath}`);
            return next();
        }

        // 2. ⚡ DYNAMIC RATE LIMIT CHECK
        // Instead of hardcoded values, we pass the specific service's database rules!
        const windowInSeconds = serviceConfig.rateLimitWindow || 60;
        const maxRequests = serviceConfig.rateLimitMax || 5;
        
        // We simulate your rate limiter internally
        console.log(windowInSeconds, maxRequests);
        const isRateLimited = await checkRateLimit(req, windowInSeconds, maxRequests);
        console.log(isRateLimited);
        if (isRateLimited) {
            return res.status(429).json({ 
                error: `Too many requests to ${serviceConfig.name}. Please try again in ${windowInSeconds} seconds.` 
            });
        }

        // 3. DYNAMIC AUTHENTICATION CHECK
        const shortPath = fullPath.replace(serviceConfig.apiPrefix.trim().toLowerCase(), '');
        const cleanShortPath = shortPath === '' ? '/' : shortPath;
        const isPublicRoute = serviceConfig.publicRoutes.some(route => route.trim().toLowerCase() === cleanShortPath);

        if (!isPublicRoute) {
            return authGuard(req, res, () => {
                executeProxy(req, res, next, serviceConfig);
            });
        }

        executeProxy(req, res, next, serviceConfig);

    } catch (error) {
        console.error('❌ Dynamic Router Error:', error);
        res.status(500).json({ error: 'Internal Gateway Routing Error' });
    }
};

function executeProxy(req, res, next, serviceConfig) {
    const dynamicProxy = createProxyMiddleware({
        target: serviceConfig.targetUrl,
        changeOrigin: true,
        pathRewrite: (path, req) => {
            const originalFullRoute = `/api${path}`;
            const strippedRoute = originalFullRoute.replace(serviceConfig.apiPrefix, '');
            return strippedRoute === '' ? '/' : strippedRoute;
        },
        on: {
            proxyReq: fixRequestBody,
            error: (err, req, res) => {
                res.status(502).json({ message: `Gateway cannot reach ${serviceConfig.name}` });
            }
        }
    });

    return dynamicProxy(req, res, next);
}

module.exports = dynamicRouter;