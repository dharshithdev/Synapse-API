const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const Service = require('../models/Service');
const authGuard = require('./authGuard'); // Make sure you created gateway/src/middleware/authGuard.js

const dynamicRouter = async (req, res, next) => {
    try {
        // 1. Fetch active configurations from MongoDB
        const services = await Service.find({ isActive: true });
        
        // 2. Build incoming path to check against database rules
        const fullPath = `/api${req.url}`.trim().toLowerCase();
        console.log(`🔍 Scanning database rules for path: ${fullPath}`);

        // 3. Find match using clean string validation
        const serviceConfig = services.find(service => {
            if (!service.apiPrefix) return false;
            const databasePrefix = service.apiPrefix.trim().toLowerCase();
            return fullPath.startsWith(databasePrefix);
        });

        if (!serviceConfig) {
            console.log(`⚠️ No registered service matches prefix for: ${fullPath}`);
            return next();
        }

        console.log(`🎯 Match found! Routing "${fullPath}" to -> ${serviceConfig.name} (${serviceConfig.targetUrl})`);

        // 4. 🧠 DYNAMIC AUTHENTICATION CHECK
        // Extract the sub-path inside the microservice (e.g., '/api/auth/register' becomes '/register')
        const shortPath = fullPath.replace(serviceConfig.apiPrefix.trim().toLowerCase(), '');
        const cleanShortPath = shortPath === '' ? '/' : shortPath;

        // Check if the current route is listed in the database's public array
        const isPublicRoute = serviceConfig.publicRoutes.some(route => route.trim().toLowerCase() === cleanShortPath);

        if (!isPublicRoute) {
            // 🔒 Route is private! Fire the authentication shield guard
            return authGuard(req, res, () => {
                executeProxy(req, res, next, serviceConfig);
            });
        }

        // 🔓 Route is public! Bypass authentication completely
        console.log(`🔓 Public endpoint detected (${cleanShortPath}). Bypassing auth guard.`);
        executeProxy(req, res, next, serviceConfig);

    } catch (error) {
        console.error('❌ Dynamic Router Error:', error);
        res.status(500).json({ error: 'Internal Gateway Routing Error' });
    }
};

// Isolated helper wrapper function to execute the proxy handler
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
                console.error(`❌ Dynamic proxy failed for ${serviceConfig.name}:`, err.message);
                res.status(502).json({ message: `Gateway cannot reach ${serviceConfig.name}` });
            }
        }
    });

    return dynamicProxy(req, res, next);
}

module.exports = dynamicRouter;