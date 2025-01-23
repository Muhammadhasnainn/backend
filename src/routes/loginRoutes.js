const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/logincontroller');

// Login Route
router.post('/login', loginUser);

module.exports = router;
