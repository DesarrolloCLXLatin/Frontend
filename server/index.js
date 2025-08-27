// server/index.js - Servidor principal reorganizado
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Importar configuración y middleware
const { corsConfig } = require('./config/cors');
const { authMiddleware } = require('./middleware/auth');
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiting');

// Importar rutas
const authRoutes = require('./routes/auth');
const runnersRoutes = require('./routes/runners');
const paymentsRoutes = require('./routes/payments');
const ticketsRoutes = require('./routes/tickets');
const dashboardRoutes = require('./routes/dashboard');
const inventoryRoutes = require('./routes/inventory');
const rbacRoutes = require('./routes/rbac');
const exchangeRatesRoutes = require('./routes/exchangeRates');

const app = express();
const PORT = process.env.PORT || 30500;

// Configuración de seguridad
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Configuración de CORS
app.use(cors(corsConfig));

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api', rateLimiter);

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../dist')));

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/runners', runnersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/rbac', rbacRoutes);
app.use('/api/exchange-rates', exchangeRatesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Fallback para SPA - servir index.html para rutas no API
app.get('*', (req, res) => {
  // Solo servir index.html si no es una ruta de API
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
  console.log(`💾 Modo: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;