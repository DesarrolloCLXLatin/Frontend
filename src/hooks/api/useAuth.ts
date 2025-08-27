// src/hooks/api/useAuth.ts - Hook para operaciones de autenticación
import { useState } from 'react';
import { authApi } from '../../services/api/authApi';
import type { LoginCredentials, RegisterData } from '../../services/api/authApi';
import type { User } from '../../types';

export const useAuthOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authApi.login(credentials);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en login';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authApi.register(userData);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error en registro';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await authApi.updateProfile(updates);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando perfil';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    login,
    register,
    updateProfile,
    loading,
    error,
    clearError
  };
};