const express = require('express');
const router = express.Router();
const multer = require('multer')
const { health, aiResponse, imageRec } = require('../controllers/LLM');
;

const upload = multer({ storage: multer.memoryStorage() });

router.get('/health', health);
router.post('/aiResponse', aiResponse);
router.post('/employeDetails', upload.array('images', 4), imageRec);

module.exports = router;