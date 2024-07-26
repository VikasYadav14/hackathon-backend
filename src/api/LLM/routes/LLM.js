const express = require('express');
const router = express.Router();
const { health, aiResponse } = require('../controllers/LLM');

router.get('/health', health);
router.post('/aiResponse', aiResponse);

module.exports = router;