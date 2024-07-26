const express = require('express');
const router = express.Router();
const { register, logIn, listUsers } = require('../controllers/loginRegister');

// all api routes----------------------------------------------
router.post('/signUp', register);
router.post('/signIn', logIn);
router.get('/getalluser', listUsers);


module.exports = router;