const express = require('express');
const router = express.Router();
const { register, logIn } = require('../controllers/loginRegister')

// all api routes----------------------------------------------
router.post('/signUp', register);
router.post('/signIn',logIn);


module.exports = router;