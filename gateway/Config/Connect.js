const mongoose = require("mongoose");
require("dotenv").config()

const connectToDB = async () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("Connected to MongoDB");
    }).catch((error) => {
        console.log("Cannot Initialize Connection : ", error);
    })
}

module.exports = {connectToDB};