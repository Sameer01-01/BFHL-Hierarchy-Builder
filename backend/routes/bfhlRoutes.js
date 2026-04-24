const express = require('express');
const router = express.Router();
const bfhlController = require('../controllers/bfhlController');

// GET /bfhl - Health check and user info
router.get('/', bfhlController.getInfo);

// POST /bfhl - Process graph data
router.post('/', bfhlController.processData);

module.exports = router;
