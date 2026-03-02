const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getAdminData } = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware'); // <-- Import middlewares

router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (Requires valid JWT)
router.get('/me', protect, getMe);

// Protected & Authorized routes (Requires valid JWT AND 'Admin' role)
router.get('/admin-data', protect, authorize('Admin'), getAdminData);

module.exports = router;