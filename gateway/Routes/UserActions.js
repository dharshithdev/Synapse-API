const express = require('express');
const router = express.Router();
const {protect} = require('../Middleware/Protect'); // Token verification middleware
const {getServices, addService, deleteService, updateService, getServiceById, getGlobalMetrics} 
    = require('../Controllers/UserController');

router.get('/services', protect, getServices);
router.get('/metrics', protect, getGlobalMetrics);
router.get('/services/:id', protect, getServiceById);
router.post('/services', protect, addService);
router.put('/services/:id', protect, updateService);
router.delete('/services/:id', protect, deleteService);

module.exports = router;