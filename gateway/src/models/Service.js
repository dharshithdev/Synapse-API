const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },          // e.g., "Auth Service"
    apiPrefix: { type: String, required: true, unique: true }, // e.g., "/api/auth"
    targetUrl: { type: String, required: true },      // e.g., "http://127.0.0.1:5001"
    isActive: { type: Boolean, default: true },       // Control via dashboard toggles
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', ServiceSchema);