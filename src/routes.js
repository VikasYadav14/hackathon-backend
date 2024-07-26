const express = require('express');
const router = express.Router();
const LLMroutes = require('./api/LLM/routes/LLM');
const loginRegister = require('./api/loginRegister/routes/loginRegister')

router.use('/',LLMroutes);
router.use('/',loginRegister);

module.exports = router;