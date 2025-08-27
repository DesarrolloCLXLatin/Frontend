// server/controllers/authController.js - Controlador de autenticación
const { authService } = require('../services/authService');
const { validateRequest } = require('../utils/validators');

const authController = {
  // Login de usuario
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      // Validar entrada
      const validation = validateRequest(req.body, {
        email: { required: true, type: 'email' },
        password: { required: true, minLength: 6 }
      });

      if (!validation.isValid) {
        return res.status(400).json({
          error: 'Datos inválidos',
          details: validation.errors
        });
      }

      const result = await authService.login(email, password);
      
      res.json({
        success: true,
        token: result.token,
        user: result.user
      });
    } catch (error) {
      next(error);
    }
  },

  // Registro de usuario
  register: async (req, res, next) => {
    try {
      const { email, password, role, full_name } = req.body;
      
      const validation = validateRequest(req.body, {
        email: { required: true, type: 'email' },
        password: { required: true, minLength: 6 },
        full_name: { required: true, minLength: 2 },
        role: { required: true, enum: ['admin', 'tienda', 'usuario', 'administracion', 'boss'] }
      });

      if (!validation.isValid) {
        return res.status(400).json({
          error: 'Datos inválidos',
          details: validation.errors
        });
      }

      const result = await authService.register(email, password, role, full_name);
      
      res.status(201).json({
        success: true,
        message: 'Usuario registrado correctamente',
        user: result.user
      });
    } catch (error) {
      next(error);
    }
  },

  // Obtener perfil del usuario actual
  getProfile: async (req, res, next) => {
    try {
      const userProfile = await authService.getUserProfile(req.user.id);
      
      res.json({
        success: true,
        user: userProfile
      });
    } catch (error) {
      next(error);
    }
  },

  // Actualizar perfil
  updateProfile: async (req, res, next) => {
    try {
      const updates = req.body;
      const updatedUser = await authService.updateUserProfile(req.user.id, updates);
      
      res.json({
        success: true,
        user: updatedUser
      });
    } catch (error) {
      next(error);
    }
  },

  // Logout
  logout: async (req, res, next) => {
    try {
      // En un sistema stateless con JWT, el logout es principalmente del lado del cliente
      // Aquí podrías agregar el token a una blacklist si es necesario
      
      res.json({
        success: true,
        message: 'Sesión cerrada correctamente'
      });
    } catch (error) {
      next(error);
    }
  },

  // Obtener lista de usuarios (admin)
  getUsers: async (req, res, next) => {
    try {
      const { page = 1, limit = 50, search = '' } = req.query;
      
      const result = await authService.getUsers({
        page: parseInt(page),
        limit: parseInt(limit),
        search
      });
      
      res.json({
        success: true,
        users: result.users,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  },

  // Obtener usuario por ID
  getUserById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await authService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({
          error: 'Usuario no encontrado'
        });
      }
      
      res.json({
        success: true,
        user
      });
    } catch (error) {
      next(error);
    }
  },

  // Actualizar usuario (admin)
  updateUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const updatedUser = await authService.updateUser(id, updates);
      
      res.json({
        success: true,
        user: updatedUser
      });
    } catch (error) {
      next(error);
    }
  },

  // Eliminar usuario (admin)
  deleteUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      await authService.deleteUser(id);
      
      res.json({
        success: true,
        message: 'Usuario eliminado correctamente'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = {
  authController
};