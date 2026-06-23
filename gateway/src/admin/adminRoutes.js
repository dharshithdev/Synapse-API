const express = require('express');
const router = express.Router();
const { getAllServices, registerService, updateService, deleteService } = require('./adminController');

// All control-panel routes map cleanly right here
router.get('/services', getAllServices);
router.post('/services', registerService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

module.exports = router;