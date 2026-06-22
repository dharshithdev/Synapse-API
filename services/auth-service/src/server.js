require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/connect'); // Connects to MongoDB
const authRoutes = require('./routes/authRoute');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Initialize MongoDB connection
connectDB(); 

// Mount our Auth routes at the root level of this microservice
app.use('/', authRoutes);

app.listen(PORT, () => {
    console.log(` Auth Microservice running quietly on internal port ${PORT}`);
});