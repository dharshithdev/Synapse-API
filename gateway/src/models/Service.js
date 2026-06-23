const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    apiPrefix: { type: String, required: true, unique: true },
    targetUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    publicRoutes: { type: [String], default: [] } 
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);