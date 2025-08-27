# RunnerReg - Sistema Completo de Registro de Corredores

## 🏃‍♂️ Descripción

RunnerReg es una aplicación web completa para gestionar el registro de corredores en carreras deportivas. Incluye un sistema robusto de autenticación por roles, gestión de pagos, control de inventario y panel administrativo.

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- **Roles**: Admin, Tienda Autorizada, Usuario
- **Permisos granulares** por tipo de usuario
- **JWT tokens** para sesiones seguras

### 📝 Registro de Corredores
- **Formulario embebible** via iframe para patrocinadores
- **Validaciones completas** front-end y back-end
- **Subida de fotos** de perfil
- **Prevención de registros duplicados**

### 💳 Gestión de Pagos
- **Pagos inmediatos** en tienda (confirmación automática)
- **Pagos diferidos** (Zelle, transferencias) con confirmación manual
- **Estados**: Pendiente, Confirmado, Rechazado
- **Trazabilidad completa** de transacciones

### 🏃‍♀️ Asignación de Números
- **Numeración automática** tras confirmación de pago
- **Secuencia controlada** para evitar duplicados
- **Reserva temporal** durante proceso de pago

### 📦 Control de Inventario
- **Stock por tallas** (XS, S, M, L, XL, XXL)
- **Reserva automática** al registrarse
- **Confirmación de stock** al confirmar pago
- **Prevención de sobreventa**
- **Alertas de stock bajo**

### 📊 Panel Administrativo
- **Dashboard con métricas** en tiempo real
- **Gestión de corredores** y estados
- **Confirmación manual** de pagos
- **Reportes y exportación** CSV
- **Análisis de datos** y tendencias

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **React Router** para navegación
- **React Hook Form** + Yup para formularios
- **Lucide React** para iconos
- **React Hot Toast** para notificaciones

### Backend
- **Node.js** con Express
- **Supabase** como base de datos PostgreSQL
- **JWT** para autenticación
- **Multer** para subida de archivos
- **Helmet** para seguridad
- **Rate limiting** para protección

### Base de Datos
- **PostgreSQL** via Supabase
- **Row Level Security (RLS)**
- **Funciones almacenadas** para lógica compleja
- **Triggers** para actualizaciones automáticas

## 🚀 Instalación y Configuración

### Prerequisitos
- Node.js 18+
- Cuenta de Supabase
- Git

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd runnerreg
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de Supabase:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
JWT_SECRET=tu_secreto_jwt_seguro
```

### 4. Configurar Supabase

1. Crea un nuevo proyecto en [Supabase](https://supabase.com)
2. Ejecuta la migración SQL desde `supabase/migrations/`
3. Configura las políticas RLS según el archivo de migración

### 5. Ejecutar la aplicación

#### Desarrollo
```bash
# Frontend (puerto 5173)
npm run dev

# Backend (puerto 3001)
npm run server
```

#### Producción
```bash
npm run build
npm start
```

## 📋 Uso del Sistema

### Para Administradores
1. **Login** con credenciales de admin
2. **Gestionar corredores** - ver, editar, eliminar registros
3. **Confirmar pagos** - revisar y aprobar transacciones
4. **Controlar inventario** - ajustar stock por tallas
5. **Generar reportes** - exportar datos y análisis

### Para Tiendas Autorizadas
1. **Registrar corredores** con pago inmediato
2. **Ver sus registros** y estados
3. **Confirmar pagos** en efectivo automáticamente

### Para Usuarios
1. **Registrarse** via formulario público
2. **Subir foto** de perfil
3. **Consultar estado** de inscripción y pago
4. **Ver número** de corredor asignado

### Formulario Embebible
Integra el formulario en cualquier sitio web:
```html
<iframe 
  src="https://tu-dominio.com/embed" 
  width="100%" 
  height="800"
  frameborder="0">
</iframe>
```

## 🔒 Seguridad

- **Rate limiting** en endpoints críticos
- **Validación de archivos** subidos
- **Sanitización de inputs**
- **Row Level Security** en base de datos
- **JWT tokens** con expiración
- **Helmet.js** para headers de seguridad
- **CORS** configurado apropiadamente

## 📊 Base de Datos

### Tablas Principales
- `users` - Usuarios y roles
- `runners` - Corredores registrados
- `payments` - Historial de pagos
- `inventory` - Stock por tallas
- `runner_numbers` - Secuencia de números

### Funciones Importantes
- `get_next_runner_number()` - Obtiene próximo número
- `reserve_inventory()` - Reserva stock temporalmente
- `confirm_inventory()` - Confirma venta de stock
- `release_inventory()` - Libera stock reservado

## 🔧 Personalización

### Agregar Nuevas Tallas
1. Actualizar enum en la migración SQL
2. Agregar opciones en el formulario frontend
3. Inicializar stock en inventario

### Modificar Precios
1. Ajustar monto en tabla `payments`
2. Actualizar cálculos en dashboard
3. Modificar textos informativos

### Integrar Procesadores de Pago
1. Agregar endpoints en `/api/payments`
2. Implementar webhooks correspondientes
3. Actualizar estados automáticamente

## 📈 Métricas y Reportes

El sistema incluye:
- **Dashboard en tiempo real** con KPIs
- **Gráficos de registro** por día
- **Análisis por método** de pago
- **Exportación CSV** de todos los datos
- **Alertas de inventario** bajo

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas:
- Abrir un issue en GitHub
- Contactar al equipo de desarrollo
- Revisar la documentación en `/docs`

## 🔄 Actualizaciones

### v1.0.0
- Sistema base completo
- Autenticación por roles
- Gestión de pagos
- Control de inventario
- Panel administrativo

### Próximas versiones
- Integración con procesadores de pago
- Notificaciones por email/SMS
- App móvil complementaria
- Análisis avanzados con gráficos