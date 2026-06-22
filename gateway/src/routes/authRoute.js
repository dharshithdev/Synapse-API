const express = require('express');
const router = express.Router();
const { createProxyMiddleware } = require('http-proxy-middleware');

// This proxy intercepts requests to port 5000 and ships them to port 5001
const authProxy = createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
    changeOrigin: true,
});

// Pass ALL incoming requests on this path over to the Auth Microservice
router.use('/', authProxy);

module.exports = router;