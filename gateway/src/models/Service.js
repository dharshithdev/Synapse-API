const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    apiPrefix: { type: String, required: true, unique: true },
    targetUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    publicRoutes: { type: [String], default: [] },
    rateLimitWindow: { type: Number, default: 60 }, // time window in seconds
    rateLimitMax: { type: Number, default: 5 }      // max requests allowed in that window
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);