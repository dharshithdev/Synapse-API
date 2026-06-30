const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
require("dotenv").config();
const path = require("path");
const {connectToDB} = require("./Config/Connect");

const PORT = process.env.PORT;

const allowedOrigins = [
  'http://localhost:3000',    
  'https://marvelsato.com',           // New custom domain
  'https://www.marvelsato.com',       // Include www
  process.env.FRONTEND_URL               
];

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS blocked: This site is not authorized.'));
    }
  },
  credentials: true 
}));

app.use(express.json())

const authRoute = require('./Routes/UserAuth');
app.use('/api/verify', authRoute);

const actionRoute = require('./Routes/UserActions');
app.use('/api/dashboard-mgmt/actions', actionRoute);

const accountRoute = require('./Routes/AccountRoute');
app.use('/api/account', accountRoute);

const ipRoute = require('./Routes/IPRoute');
app.use('/api/dashboard-mgmt/ip', ipRoute);

app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

connectToDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log("Server Running on PORT ", PORT);
    });
});
