const bcrypt = require('bcryptjs');
const User = require('../Models/User'); // Adjust path to your auth user model
const Service = require('../Models/Service'); // To count clusters or clean up on deletion

// @desc    Get current user profile metrics
// @route   GET /api/account/profile
const getUserProfile = async (req, res) => {
    try {
        // req.user.id populated by your JWT auth middleware
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User matrix node not found.' });

        // Fetch dynamic stats belonging to this developer
        const clusterCount = await Service.countDocuments(); // Modify if services are tied to specific users

        res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role || 'Cluster Administrator',
                createdAt: user.createdAt
            },
            metrics: {
                totalClusters: clusterCount,
                securityLevel: 'Tier-1 Enforced'
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Failed to synchronize account telemetry.', error: err.message });
    }
};

// @desc    Update basic info or password securely
// @route   PUT /api/account/profile
const updateAccountSettings = async (req, res) => {
    try {
        console.log('A');
        const { name, email, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select("+password");
        if (!user) return res.status(404).json({ message: 'Account node missing.' });

        // Phase 1: Email/Name modifications
        if (name) user.name = name;
        if (email) {
            // Check if email is already taken by another cluster admin
            const emailExists = await User.findOne({ email });
            if (emailExists && emailExists._id.toString() !== user._id.toString()) {
                return res.status(400).json({ message: 'Target email alias already claimed by another node.' });
            }
            user.email = email;
        }

        // Phase 2: Secure Password Mutation
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Current password verification required.' });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid current verification password.' });
            }
            
            // Hash the fresh parameter rewrite
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }
        console.log('C');
        await user.save();
        res.status(200).json({ message: 'Account core configuration rewritten successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to commit profile updates.', error: err.message });
    }
};

// @desc    Cascade purge entire user profile and access scopes
// @route   DELETE /api/account/profile
const purgeAccountNode = async (req, res) => {
    try {
        const { verificationString } = req.body;
        const user = await User.findById(req.user.id);
        
        if (!user) return res.status(404).json({ message: 'Target node missing.' });
        
        // Strict verification matching GitHub's explicit check string
        if (verificationString !== user.email) {
            return res.status(400).json({ message: 'Purge authorization payload string verification mismatch.' });
        }

        // Drop the account out of MongoDB database
        await User.findByIdAndDelete(req.user.id);
        
        // Optional: Clean up associated proxies if needed
        // await Service.deleteMany({ owner: req.user.id });

        res.status(200).json({ message: 'Account sequence wiped entirely from core systems.' });
    } catch (err) {
        res.status(500).json({ message: 'Purge execution sequence abort error.', error: err.message });
    }
};

module.exports = { getUserProfile, updateAccountSettings, purgeAccountNode };