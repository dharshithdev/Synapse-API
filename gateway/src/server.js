require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Added mongoose to read configs
const { connectRedis } = require('./config/redis');
const rateLimiter = require('./middleware/rateLimitter'); 
const dynamicRouter = require('./middleware/dynamicRoute'); // Our brand new engine!

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectRedis();

// Connect the gateway to the exact same MongoDB database your app uses
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('📁 Gateway configuration database linked!'))
    .catch(err => console.error('Gateway DB Connection Error:', err));

// Spy logger
app.use((req, res, next) => {
    console.log(`📣 Request incoming at Gateway: ${req.method} ${req.url}`);
    next();
});

// Apply the global rate limiter across your API entry configurations,
// then catch all requests dynamically!
app.use('/api', rateLimiter(5, 60), dynamicRouter);

app.listen(PORT, () => {
    console.log(`🚀 Dynamic Gatekeeper is active on port ${PORT}`);
});