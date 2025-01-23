const express = require('express');
const { forgotPassword } = require('../controllers/authController');
const router = express.Router();

// Forgot password route
router.post('/forgot-password', forgotPassword);

module.exports = router;
