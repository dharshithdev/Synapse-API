// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const protect = async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try { 
            const token = req.headers.authorization.split(' ')[1]; 
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 

            const user = await User.findById(decoded.id).select('-password'); 

            if (!user) {
                return res.status(401).json({ message: 'User no longer exists' });
            }
            req.user = user;
            next();
        } catch (error) { 
            res.status(401).json({ message: 'Not authorized, token failed' });
            console.log('Errorrr : ', error.message);
            console.log('Errorrr : ', error);
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = {protect};