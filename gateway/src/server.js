require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectRedis } = require('./config/redis');
const rateLimiter = require('./middleware/rateLimitter'); // 1. Import the Limiter

// Import Modular Routes
//const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/authRoute');
//const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Redis Memory Connection
connectRedis();

// Mount Routes
//app.use('/health', healthRoutes);

// 2. Protect our API routes with customized rules!
// Allow 5 requests per minute for authentication (prevents brute-force attacks)
app.use('/api/auth', rateLimiter(5, 60), authRoutes);

// Allow 10 requests per minute for heavy AI processing
//app.use('/api/ai', rateLimiter(10, 60), aiRoutes);

app.listen(PORT, () => {
    console.log(`Synapse API is active on ${process.env.VERCEL_URI}:${PORT}`);
});