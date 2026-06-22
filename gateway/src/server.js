require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectRedis } = require('./config/redis');
const rateLimiter = require('./middleware/rateLimitter'); 
const authRoutes = require('./routes/authRoute');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Redis Memory Connection
connectRedis();

// 💡 SPY LOG: This logs every single request that hits the gateway
app.use((req, res, next) => {
    console.log(`📣 Request incoming at Gateway: ${req.method} ${req.url}`);
    next();
});

// Clean standard route path mapping
app.use('/api/auth', rateLimiter(5, 60), authRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Gateway is active on port ${PORT}`);
});