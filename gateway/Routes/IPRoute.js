const express = require('express');
const router = express.Router();
const { protect } = require('../Middleware/Protect');
const { addRule, getRules, deleteRule } = require('../Controllers/IPController');

// Secure all endpoints with your verification middleware layer
router.post('/add', protect, addRule);
router.get('/list', protect, getRules);
router.delete('/:id', protect, deleteRule);

module.exports = router;