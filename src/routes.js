const express = require('express');
const router = express.Router();
const LLMroutes = require('./api/LLM/routes/LLM');
const loginRegister = require('./api/loginRegister/routes/loginRegister');
const mail = require('./api/mailer/route/mailer');
router.use('/', LLMroutes);
router.use('/', loginRegister);
router.use('/', mail);

module.exports = router;