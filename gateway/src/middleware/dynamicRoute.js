const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const Service = require('../models/Service');

const dynamicRouter = async (req, res, next) => {
    try {
        // 1. Fetch active configurations
        const services = await Service.find({ isActive: true });
        
        // 🚨 EXTRA DEBUG LOGGER: Let's see exactly what Mongoose parsed out of MongoDB
        console.log("📁 Parsed documents from Mongoose array:", JSON.stringify(services, null, 2));

        // 2. Build incoming path
        const fullPath = `/api${req.url}`.trim().toLowerCase();
        console.log(`🔍 Scanning database rules for path: ${fullPath}`);

        // 3. Find match using a clean string validation
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

        // 4. Create and execute proxy
        // 4. Create and execute the proxy middleware structure seamlessly
    const dynamicProxy = createProxyMiddleware({
        target: serviceConfig.targetUrl,
        changeOrigin: true,
        pathRewrite: (path, req) => {
            // serviceConfig.apiPrefix is "/api/auth"
            // This clean utility strips "/api/auth" directly off the full original route safely
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

    } catch (error) {
        console.error('Dynamic Router Error:', error);
        res.status(500).json({ error: 'Internal Gateway Routing Error' });
    }
};

module.exports = dynamicRouter;