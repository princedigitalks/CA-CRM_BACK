const express = require('express');
const router = express.Router();
const { registerToken } = require('../controllers/userController');

router.post('/register-token', registerToken);

module.exports = router;
