# Plan de Refactorización Frontend - Estructura Modular

## 📋 Análisis de la Estructura Actual

### Estado Actual del Frontend
```
src/
├── components/          ✅ Bien organizado pero mejorable
│   ├── Auth/           ✅ Separación clara
│   ├── Dashboard/      ✅ Componentes por funcionalidad
│   ├── Layout/         ✅ Componentes de layout
│   ├── Registration/   ⚠️  Muy anidado, necesita simplificación
│   ├── Tickets/        ⚠️  Estructura compleja
│   └── ...
├── contexts/           ✅ Bien organizado
├── hooks/              ⚠️  Pocos hooks, lógica en componentes
├── types/              ✅ Bien centralizado
├── utils/              ⚠️  Solo supabase, falta organización
└── App.tsx             ⚠️  Muy grande, lógica de routing compleja
```

### Problemas Identificados
1. **Componentes muy grandes**: Algunos componentes superan 300 líneas
2. **Lógica mezclada**: Estado, efectos y UI en el mismo archivo
3. **Hooks insuficientes**: Lógica repetida en múltiples componentes
4. **Servicios faltantes**: Llamadas API dispersas en componentes
5. **Validaciones dispersas**: Lógica de validación en múltiples lugares
6. **Configuración mezclada**: Constantes y configuración en componentes

## 🎯 Estructura Objetivo

```
src/
├── components/              # Componentes UI puros
│   ├── common/             # Componentes reutilizables
│   │   ├── Button/
│   │   ├── Modal/
│   │   ├── Form/
│   │   └── Table/
│   ├── layout/             # Componentes de layout
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   └── Footer/
│   └── features/           # Componentes por funcionalidad
│       ├── auth/
│       ├── dashboard/
│       ├── runners/
│       ├── payments/
│       └── tickets/
├── hooks/                  # Custom hooks
│   ├── api/               # Hooks para API calls
│   ├── auth/              # Hooks de autenticación
│   ├── forms/             # Hooks para formularios
│   └── ui/                # Hooks para UI
├── services/              # Servicios de API y lógica de negocio
│   ├── api/               # Clientes API
│   ├── auth/              # Servicios de autenticación
│   ├── validation/        # Servicios de validación
│   └── storage/           # Servicios de almacenamiento
├── stores/                # Estado global (Zustand/Redux)
│   ├── auth/
│   ├── ui/
│   └── data/
├── utils/                 # Utilidades puras
│   ├── formatters/
│   ├── validators/
│   ├── constants/
│   └── helpers/
├── types/                 # Tipos TypeScript
│   ├── api/
│   ├── components/
│   └── global/
├── config/                # Configuración
│   ├── api.ts
│   ├── routes.ts
│   └── constants.ts
└── pages/                 # Páginas principales (opcional)
    ├── Dashboard/
    ├── Auth/
    └── ...
```

## 🚀 Plan de Migración Progresiva

### Fase 1: Crear Estructura Base (Sin romper nada)
1. Crear nuevas carpetas
2. Crear archivos base con exports
3. Mantener imports existentes

### Fase 2: Extraer Servicios y Utilidades
1. Mover lógica de API a servicios
2. Extraer utilidades comunes
3. Centralizar configuración

### Fase 3: Refactorizar Hooks
1. Extraer lógica de estado a hooks
2. Crear hooks reutilizables
3. Simplificar componentes

### Fase 4: Modularizar Componentes
1. Dividir componentes grandes
2. Extraer componentes comunes
3. Mejorar reutilización

### Fase 5: Optimizar Estado Global
1. Implementar estado global donde sea necesario
2. Reducir prop drilling
3. Mejorar performance

## ✅ Checklist de Validación

### Después de cada fase:
- [ ] La aplicación inicia sin errores
- [ ] Todas las rutas funcionan
- [ ] Los formularios se envían correctamente
- [ ] La autenticación funciona
- [ ] Los dashboards cargan datos
- [ ] Las exportaciones funcionan
- [ ] No hay errores en consola
- [ ] Los tipos TypeScript son válidos

## 🔧 Compatibilidad

### Build y Deploy
- Mantener configuración de Vite
- Preservar estructura de assets
- Mantener rutas de API proxy
- Conservar configuración de TypeScript

### Performance
- Implementar lazy loading
- Optimizar bundle splitting
- Mejorar tree shaking
- Reducir re-renders innecesarios