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
async function startServer() {
  try {
    // 1. Connect to MongoDB
    await connectDB();
    
    // 2. Await the Redis Handshake completely 
    await connectRedis();
    
    // 3. Start listening only after infrastructure is ready
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Synapse Distributed Core Proxy Operational on port ${PORT}`);
    });
  } catch (error) {
    console.error("🛑 Server boot crash:", error);
    process.exit(1);
  }
}

startServer();

app.use(cors());
//app.use(ipFirewall);

// Mount the clean, isolated proxy router module onto the base endpoint structure
app.use('/api/v1', proxyRouter);

app.listen(PORT, '0.0.0.0', () => {
    console.log(` Synapse Distributed Core Proxy Operational on port ${PORT}`);
});