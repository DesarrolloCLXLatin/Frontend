# Plan de Refactorización - Estructura Modular Backend

## 📋 Análisis de la Estructura Actual

### Frontend (Ya bien estructurado)
```
src/
├── components/          ✅ Bien organizado
├── contexts/           ✅ Bien organizado  
├── hooks/              ✅ Bien organizado
├── types/              ✅ Bien organizado
└── utils/              ✅ Bien organizado
```

### Backend (Necesita reorganización)
```
server/ (actualmente inexistente - todo mezclado)
├── index.js            ❌ Falta - servidor principal
├── routes/             ❌ Falta - rutas organizadas
├── controllers/        ❌ Falta - lógica de controladores
├── services/           ❌ Falta - lógica de negocio
├── models/             ❌ Falta - modelos de datos
├── middleware/         ❌ Falta - middleware personalizado
├── utils/              ❌ Falta - utilidades del servidor
└── config/             ❌ Falta - configuración
```

## 🎯 Estructura Objetivo

```
project/
├── src/                     # Frontend (mantener como está)
├── server/                  # Backend reorganizado
│   ├── index.js            # Servidor principal
│   ├── app.js              # Configuración de Express
│   ├── config/             # Configuración
│   │   ├── database.js
│   │   ├── auth.js
│   │   ├── cors.js
│   │   └── environment.js
│   ├── middleware/         # Middleware personalizado
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── rateLimiting.js
│   │   └── errorHandler.js
│   ├── routes/             # Rutas organizadas
│   │   ├── index.js
│   │   ├── auth.js
│   │   ├── runners.js
│   │   ├── payments.js
│   │   ├── tickets.js
│   │   └── dashboard.js
│   ├── controllers/        # Controladores
│   │   ├── authController.js
│   │   ├── runnersController.js
│   │   ├── paymentsController.js
│   │   └── ticketsController.js
│   ├── services/           # Lógica de negocio
│   │   ├── authService.js
│   │   ├── paymentService.js
│   │   ├── emailService.js
│   │   └── inventoryService.js
│   ├── models/             # Modelos de datos
│   │   ├── User.js
│   │   ├── Runner.js
│   │   ├── Payment.js
│   │   └── Ticket.js
│   ├── utils/              # Utilidades del servidor
│   │   ├── validators.js
│   │   ├── helpers.js
│   │   └── constants.js
│   └── scripts/            # Scripts de mantenimiento
│       └── updateExchangeRate.js
├── public/                 # Assets estáticos (mantener)
└── package.json            # Dependencias (mantener)
```

## 🚀 Plan de Migración Progresiva

### Fase 1: Crear Estructura Base (Sin romper nada)
1. Crear carpetas del servidor
2. Crear archivos base con exports vacíos
3. Mantener funcionamiento actual

### Fase 2: Migrar Configuración
1. Extraer configuración a archivos dedicados
2. Centralizar variables de entorno
3. Organizar configuración de base de datos

### Fase 3: Migrar Middleware
1. Extraer middleware a archivos separados
2. Organizar autenticación y validación
3. Centralizar manejo de errores

### Fase 4: Migrar Rutas y Controladores
1. Separar rutas de lógica de negocio
2. Crear controladores específicos
3. Mantener compatibilidad de endpoints

### Fase 5: Migrar Servicios y Modelos
1. Extraer lógica de negocio a servicios
2. Crear modelos de datos
3. Organizar utilidades

## ✅ Checklist de Validación

### Después de cada fase:
- [ ] El servidor inicia correctamente
- [ ] Todas las rutas responden
- [ ] El frontend se conecta sin errores
- [ ] Los tests pasan (si existen)
- [ ] No hay errores en consola
- [ ] Las funcionalidades críticas funcionan

### Validaciones específicas:
- [ ] Autenticación funciona
- [ ] Registro de corredores funciona
- [ ] Pagos se procesan correctamente
- [ ] Emails se envían
- [ ] Dashboard carga datos
- [ ] Exportaciones funcionan

## 🔧 Compatibilidad con Despliegue

### Plesk/Nginx
- Mantener `package.json` en raíz
- Preservar scripts de inicio
- Mantener estructura de archivos estáticos
- Conservar configuración de proxy

### SPA + Backend
- Mantener servido de archivos estáticos
- Preservar rutas de API con prefijo `/api`
- Mantener fallback para rutas del frontend
- Conservar configuración de CORS