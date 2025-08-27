// server/middleware/auth.js - Middleware de autenticación
const { verifyToken } = require('../config/auth');
const { supabase } = require('../config/database');

// Middleware principal de autenticación
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Token de acceso requerido',
        code: 'NO_TOKEN'
      });
    }

    // Verificar y decodificar el token
    const decoded = verifyToken(token);
    
    // Obtener información completa del usuario desde la base de datos
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        id, email, role, full_name, created_at,
        user_roles!inner(
          roles!inner(
            id, name, display_name, is_system
          )
        )
      `)
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({ 
        error: 'Usuario no encontrado',
        code: 'USER_NOT_FOUND'
      });
    }

    // Agregar información del usuario al request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      roles: user.user_roles?.map(ur => ur.roles) || [],
      permissions: [], // Se cargarán bajo demanda
      modules: [] // Se cargarán bajo demanda
    };

    next();
  } catch (error) {
    console.error('Error en middleware de auth:', error);
    return res.status(401).json({ 
      error: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }
};

// Middleware para verificar roles específicos
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const userRoles = [req.user.role, ...req.user.roles.map(r => r.name)];
    const hasRole = roles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ 
        error: 'Permisos insuficientes',
        required: roles,
        current: userRoles
      });
    }

    next();
  };
};

// Middleware para verificar permisos específicos
const requirePermission = (resource, action) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    try {
      // Cargar permisos del usuario si no están cargados
      if (!req.user.permissions.length) {
        const { data: permissions } = await supabase
          .rpc('get_user_permissions', { user_id: req.user.id });
        req.user.permissions = permissions || [];
      }

      const hasPermission = req.user.permissions.includes(`${resource}:${action}`) ||
                           req.user.permissions.includes('system:manage_all');

      if (!hasPermission) {
        return res.status(403).json({ 
          error: 'Permiso denegado',
          required: `${resource}:${action}`,
          current: req.user.permissions
        });
      }

      next();
    } catch (error) {
      console.error('Error verificando permisos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
};

// Middleware para tokens de iframe
const iframeTokenMiddleware = async (req, res, next) => {
  try {
    const token = req.headers['x-iframe-token'];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Token de iframe requerido',
        code: 'NO_IFRAME_TOKEN'
      });
    }

    // Validar token de iframe
    const { data: tokenData, error } = await supabase
      .from('iframe_tokens')
      .select('*')
      .eq('token', token)
      .eq('is_active', true)
      .single();

    if (error || !tokenData) {
      return res.status(401).json({ 
        error: 'Token de iframe inválido',
        code: 'INVALID_IFRAME_TOKEN'
      });
    }

    // Verificar expiración
    if (new Date(tokenData.expires_at) < new Date()) {
      return res.status(401).json({ 
        error: 'Token de iframe expirado',
        code: 'EXPIRED_IFRAME_TOKEN'
      });
    }

    req.iframeToken = tokenData;
    next();
  } catch (error) {
    console.error('Error en middleware de iframe token:', error);
    return res.status(401).json({ 
      error: 'Error validando token de iframe',
      code: 'IFRAME_TOKEN_ERROR'
    });
  }
};

module.exports = {
  authMiddleware,
  requireRole,
  requirePermission,
  iframeTokenMiddleware
};