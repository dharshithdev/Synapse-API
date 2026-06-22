const express = require('express');
const router = express.Router();
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');

const authProxy = createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:5001', 
    changeOrigin: true,
    pathRewrite: {
        '^/api/auth': '', 
    },
    // Modern http-proxy-middleware v3 syntax requires event handlers inside 'on'
    on: {
        proxyReq: fixRequestBody,
        error: (err, req, res) => {
            console.error('❌ Proxy failed to reach Auth Service:', err.message);
            res.status(502).json({ message: 'Gateway cannot reach the Auth Service' });
        }
    }
});

router.use('/', authProxy);

module.exports = router;