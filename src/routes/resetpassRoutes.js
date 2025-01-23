const express = require('express');
const router = express.Router();
const {resetPassword} = require('../controllers/resetpassController');

// Route to reset password
router.post('/reset-password', resetPassword);

module.exports = router;
