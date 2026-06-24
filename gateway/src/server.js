require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Added mongoose to read configs
const { connectRedis } = require('./config/redis');
const rateLimiter = require('./middleware/rateLimitter'); 
const dynamicRouter = require('./middleware/dynamicRoute'); // Our brand new engine!
const ConnectDB = require('./config/connect');
const connectDB = require('./config/connect');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// Connect to Redis
connectRedis(); 

// Connect the gateway to the exact same MongoDB database your app uses
connectDB();

// Spy logger
app.use((req, res, next) => {
    console.log(`Request incoming at Gateway: ${req.method} ${req.url}`);
    next();
});

const adminRoutes = require('./admin/adminRoutes');

app.use('/api/admin', adminRoutes);

// Applying the global rate limiter across API entry configurations,
app.use('/api', dynamicRouter);

app.listen(PORT, () => {
    console.log(`Dynamic Gatekeeper is active on port ${PORT}`);
});