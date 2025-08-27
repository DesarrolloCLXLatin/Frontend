// src/services/api/authApi.ts - Servicio API de autenticación
import { apiClient, handleApiError } from './apiClient';
import type { User } from '../../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  role: string;
  full_name: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const authApi = {
  // Iniciar sesión
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error en el login');
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Registrar usuario
  async register(userData: RegisterData): Promise<{ user: User }> {
    try {
      const response = await apiClient.post<{ user: User }>('/api/auth/register', userData);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error en el registro');
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener perfil del usuario actual
  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<{ user: User }>('/api/auth/me');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error obteniendo perfil');
      }

      return response.data.user;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Actualizar perfil
  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<{ user: User }>('/api/auth/me', updates);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error actualizando perfil');
      }

      return response.data.user;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener lista de usuarios (admin)
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);

      const endpoint = `/api/auth/users${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await apiClient.get<{
        users: User[];
        pagination: any;
      }>(endpoint);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error obteniendo usuarios');
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener usuario por ID
  async getUserById(id: string): Promise<User> {
    try {
      const response = await apiClient.get<{ user: User }>(`/api/auth/users/${id}`);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Usuario no encontrado');
      }

      return response.data.user;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Actualizar usuario (admin)
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<{ user: User }>(`/api/auth/users/${id}`, updates);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error actualizando usuario');
      }

      return response.data.user;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Eliminar usuario (admin)
  async deleteUser(id: string): Promise<void> {
    try {
      const response = await apiClient.delete(`/api/auth/users/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Error eliminando usuario');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};