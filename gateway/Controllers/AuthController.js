const User = require('../Models/User');
const jwt = require('jsonwebtoken');

// Helper to generate token based on identity mapping constraint
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new tenant
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ name, email, password });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

// @desc    Auth tenant & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Explicitly select password since it's hidden by default in the schema
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};

module.exports = {registerUser, loginUser};