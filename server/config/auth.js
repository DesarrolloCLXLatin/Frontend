// server/config/auth.js - Configuración de autenticación
const jwt = require('jsonwebtoken');

const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  bcryptRounds: 12,
  
  // Configuración de sesiones
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict'
  },

  // Rate limiting para auth
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxAttempts: 5,
    skipSuccessfulRequests: true
  }
};

// Función para generar JWT
const generateToken = (payload) => {
  return jwt.sign(payload, authConfig.jwtSecret, {
    expiresIn: authConfig.jwtExpiresIn
  });
};

// Función para verificar JWT
const verifyToken = (token) => {
  try {
    return jwt.verify(token, authConfig.jwtSecret);
  } catch (error) {
    throw new Error('Token inválido');
  }
};

module.exports = {
  authConfig,
  generateToken,
  verifyToken
};