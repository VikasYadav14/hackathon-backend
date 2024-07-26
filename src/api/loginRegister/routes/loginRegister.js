const express = require('express');
const router = express.Router();
const { register, logIn } = require('../controllers/loginRegister')

router.post('/signUp', register);
router.post('/signIn',logIn);


module.exports = router;