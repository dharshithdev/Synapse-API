const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
require("dotenv").config();
const path = require("path");
const {connectToDB} = require("./Config/Connect");

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json())

const authRoute = require('./Routes/UserAuth');
app.use('/api/verify', authRoute);

const actionRoute = require('./Routes/UserActions');
app.use('/api/dashboard-mgmt/actions', actionRoute);

const accountRoute = require('./Routes/AccountRoute');
app.use('/api/account', accountRoute);

app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

connectToDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server Running on PORT ", PORT);
    });
});
