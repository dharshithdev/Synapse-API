const IPRule = require('../Models/IPRule');

const ipFirewall = async (req, res, next) => {
    try {
        // 1. Extract the client IP (handling reverse proxies like Cloudflare/Nginx safely)
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const tenantId = req.tenant._id; // Extracted during earlier auth middleware checks

        // 💡 OPTIMIZATION STEP: Ideally, pull these from a Redis set in production 
        // e.g., redis.sismember(`ip:${tenantId}:blacklist`, clientIp)
        
        // 2. Query active rule definitions from the local DB instance
        const rules = await IPRule.find({ tenantId });
        
        const blacklistedIps = rules.filter(r => r.ruleType === 'blacklist').map(r => r.ipAddress);
        const whitelistedIps = rules.filter(r => r.ruleType === 'whitelist').map(r => r.ipAddress);

        // 3. Evaluate Blacklist Criteria (Drop immediately)
        if (blacklistedIps.includes(clientIp)) {
            return res.status(403).json({
                status: 403,
                error: 'ACCESS_DENIED',
                message: 'Your IP signature has been explicitly blocked by this gateway node cluster.'
            });
        }

        // 4. Evaluate Whitelist Criteria (If a whitelist exists, IP MUST be on it)
        if (whitelistedIps.length > 0 && !whitelistedIps.includes(clientIp)) {
            return res.status(403).json({
                status: 403,
                error: 'ACCESS_RESTRICTED',
                message: 'This environment is locked down. Your IP address is not explicitly whitelisted.'
            });
        }

        // Pass validation criteria cleanly
        next();

    } catch (error) {
        // Fallback catch to prevent engine stall out states
        return res.status(500).json({ error: 'FIREWALL_EXCEPTION_FAULT' });
    }
};

module.exports = ipFirewall;