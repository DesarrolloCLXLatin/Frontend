// server/routes/auth.js - Rutas de autenticación
const express = require('express');
const { authController } = require('../controllers/authController');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/rateLimiting');

const router = express.Router();

// Rutas públicas (con rate limiting)
router.post('/login', authRateLimiter, authController.login);
router.post('/register', authRateLimiter, authController.register);

// Rutas protegidas
router.get('/me', authMiddleware, authController.getProfile);
router.put('/me', authMiddleware, authController.updateProfile);
router.post('/logout', authMiddleware, authController.logout);

// Rutas administrativas
router.get('/users', authMiddleware, requireRole('admin'), authController.getUsers);
router.get('/users/:id', authMiddleware, requireRole('admin'), authController.getUserById);
router.put('/users/:id', authMiddleware, requireRole('admin'), authController.updateUser);
router.delete('/users/:id', authMiddleware, requireRole('admin'), authController.deleteUser);

module.exports = router;