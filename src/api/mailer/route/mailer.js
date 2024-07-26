const express = require('express');
const router = express.Router();
const { newmailer, healthmail } = require('../controllers/mailer');

router.post('/sendmail', newmailer);
router.get('/mailerhealth', healthmail);



module.exports = router;