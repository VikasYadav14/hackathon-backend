const express = require('express');
const router = express.Router();
const { register, health } = require('../controllers/loginRegister');

router.post('/signUp', register);
router.get('/loginhealth', health);

module.exports = router;