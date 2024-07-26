const express = require('express');
const router = express.Router();
const { health, aiResponse, imageRec  } = require('../controllers/LLM');

router.get('/health', health);
router.post('/aiResponse', aiResponse);
router.post('/employeDetails', imageRec);

module.exports = router;