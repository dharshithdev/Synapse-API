const express = require('express');
const router = express.Router();
const {protect} = require('../Middleware/Protect'); // Token verification middleware
const {getUserProfile, updateAccountSettings, purgeAccountNode} = require('../Controllers/AccountController');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateAccountSettings);
router.delete('/profile', protect, purgeAccountNode);

module.exports = router;