const express = require('express');
const router = express.Router();
const { register } = require('../controllers/loginRegister')

router.post('/signUp', register);

module.exports = router;