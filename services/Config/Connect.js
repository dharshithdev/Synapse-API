const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(` Synapse Proxy Engine connected to DB Cluster Node: ${conn.connection.host}`);
    } catch (err) {
        console.error(` Core DB Pipeline sync fault: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;