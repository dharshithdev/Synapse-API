const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// These catch the requests handed down by the gateway proxy
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router; 