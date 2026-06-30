const IPRule = require('../Models/IPRule');

// @desc    Add a brand new IP rule statement
// @route   POST /api/ip/add
exports.addRule = async (req, res) => {
    const { ipAddress, ruleType, description } = req.body;
    try {
        const newRule = await IPRule.create({
            tenantId: req.user._id,
            ipAddress,
            ruleType,
            description
        });
        res.status(201).json({ success: true, rule: newRule });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Rule already exists or parameters are malformed.' });
    }
};

// @desc    Fetch all rules linked to the active account
// @route   GET /api/ip/list
exports.getRules = async (req, res) => {
    try {
        const activeRules = await IPRule.find({ tenantId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, rules: activeRules });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Delete an IP restriction profile matching id
// @route   DELETE /api/ip/:id
exports.deleteRule = async (req, res) => {
    try {
        await IPRule.findOneAndDelete({ _id: req.params.id, tenantId: req.user._id });
        res.json({ success: true, message: 'IP signature rule dropped successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};