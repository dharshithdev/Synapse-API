const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {
    try {
        // 1. Grab the Authorization header
        const authHeader = req.headers['authorization'];
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "Access Denied: No token provided." });
        }

        // 2. Extract the raw token string
        const token = authHeader.split(' ')[1];

        // 3. Verify the token using your environment secret
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Inject the verified user details into custom headers!
        // This allows downstream microservices to read the user ID without re-verifying the token.
        req.headers['x-user-id'] = verified.id || verified._id;
        req.headers['x-user-role'] = verified.role || 'user';

        console.log(`🔒 Security Guard: Token verified for User (${verified.id || verified._id})`);
        next(); // Pass them through!
    } catch (error) {
        console.error("🔒 Security Guard Error: Invalid Token supplied.");
        return res.status(403).json({ error: "Authentication failed: Invalid or expired token." });
    }
};

module.exports = authGuard;