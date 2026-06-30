const mongoose = require('mongoose');

const IPRuleSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ipAddress: {
        type: String, 
        required: true,
        trim: true
    },
    ruleType: {
        type: String,
        enum: ['whitelist', 'blacklist'],
        required: true
    },
    description: {
        type: String,
        maxLength: 100
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure quick unique checks per tenant configuration
IPRuleSchema.index({ tenantId: 1, ipAddress: 1 }, { unique: true });

module.exports = mongoose.model('IPRule', IPRuleSchema);