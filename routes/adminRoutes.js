const express = require('express');
const router = express.Router();
const { loginAdmin, changePassword, createInitialAdmin } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/auth/login
 * @desc    Auth admin & get token
 * @access  Public
 */
router.post('/login', loginAdmin);
router.put('/change-password', protect, changePassword);
router.post('/create-admin', createInitialAdmin); // Call this once to create initial admin

module.exports = router;
