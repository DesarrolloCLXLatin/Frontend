// server/middleware/rateLimiting.js - Rate limiting
const rateLimit = require('express-rate-limit');

// Rate limiter general para API
const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Demasiadas solicitudes desde esta IP',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Saltar rate limiting para health checks
    return req.path === '/api/health';
  }
});

// Rate limiter estricto para autenticación
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 5,
  message: {
    error: 'Demasiados intentos de login',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

// Rate limiter para uploads
const uploadRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10,
  message: {
    error: 'Demasiados uploads',
    code: 'UPLOAD_RATE_LIMIT_EXCEEDED',
    retryAfter: '1 minuto'
  }
});

// Rate limiter para pagos
const paymentRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 3,
  message: {
    error: 'Demasiados intentos de pago',
    code: 'PAYMENT_RATE_LIMIT_EXCEEDED',
    retryAfter: '5 minutos'
  }
});

module.exports = {
  rateLimiter,
  authRateLimiter,
  uploadRateLimiter,
  paymentRateLimiter
};