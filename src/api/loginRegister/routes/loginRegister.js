const express = require('express');
const router = express.Router();
const { register, health, login } = require('../controllers/loginRegister');

router.post('/signUp', register);
router.post('/login', login);
router.get('/loginhealth', health);

module.exports = router;