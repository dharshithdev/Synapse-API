// models/Analytics.js
const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    path: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    statusCode: {
        type: Number,
        required: true
    },
    responseTime: {
        type: Number, // Essential for calculating your overall average 'latency'
        required: true
    },
    timestamp: {
        type: Date, // Essential for grouping logs into 'requestsOverTime' charts
        default: Date.now
    }
}, { timestamps: true });

analyticsSchema.index({ serviceId: 1, timestamp: -1 });

module.exports = mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);