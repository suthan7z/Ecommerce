const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { userSchemas } = require('../utils/validation');

// Public routes
router.post('/register', validate(userSchemas.register), authController.register);
router.post('/login', validate(userSchemas.login), authController.login);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, validate(userSchemas.updateProfile), authController.updateProfile);

// Admin routes
router.post('/users', authMiddleware, adminMiddleware, authController.createUser);
router.get('/users', authMiddleware, adminMiddleware, authController.getAllUsers);
router.put('/users/role', authMiddleware, adminMiddleware, authController.updateUserRole);

module.exports = router;
