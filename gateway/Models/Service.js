const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Service name is required'],
        trim: true
    },
    frontendPath: {
        type: String,
        required: [true, 'Frontend proxy path is required'],
        trim: true,
        unique: true // Prevents two users from intercepting the exact same path
    },
    targetUrl: {
        type: String,
        required: [true, 'Target destination URL is required'],
        trim: true
    },
    rateLimit: {
        type: Number,
        default: 60, // Default requests per minute
        min: [1, 'Rate limit must be at least 1 request per minute']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    apiKey: { type: String, 
              unique: true, 
              required: true 
    } // Added field
}, { timestamps: true });

// Pre-save validation sanitizer to ensure uniform formatting
serviceSchema.pre('save', function(next) {
    // Ensure frontend path always starts with a single forward slash
    if (!this.frontendPath.startsWith('/')) {
        this.frontendPath = '/' + this.frontendPath;
    }
    //next();
}); 

module.exports = mongoose.model('Service', serviceSchema);