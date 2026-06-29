// models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    frontendPath: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    targetUrl: {
        type: String,
        required: true,
        trim: true
    },
    rateLimit: {
        type: Number,
        default: 60
    },
    isActive: {
        type: Boolean,
        default: true
    },
    apiKey: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

// Check the internal global cache registry first to avoid OverwriteModelError
module.exports = mongoose.models.Service || mongoose.model('Service', serviceSchema);