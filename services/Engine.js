// engine.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/Connect');
const { connectRedis } = require('./Config/Redis');
const proxyRouter = require('./Routes/ProxyRoute');
const ipFirewall = require('./Middleware/IPFirewall');

const app = express();
const PORT = process.env.PORT || 8000;

// Initialize distributed infrastructure connections
connectDB();
connectRedis();

app.use(cors());
app.use(ipFirewall);

// Mount the clean, isolated proxy router module onto the base endpoint structure
app.use('/api/v1/{*proxyPath}', proxyRouter);

app.listen(PORT, '0.0.0.0', () => {
    console.log(` Synapse Distributed Core Proxy Operational on port ${PORT}`);
});