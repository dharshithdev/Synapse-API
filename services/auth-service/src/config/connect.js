const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        
        await mongoose.connect(mongoURI);
        console.log(' MongoDB database connected successfully!');
    } catch (error) {
        console.error(' MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDatabase;