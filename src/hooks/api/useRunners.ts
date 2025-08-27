// src/hooks/api/useRunners.ts - Hook para operaciones de corredores
import { useState, useEffect, useCallback } from 'react';
import { runnersApi } from '../../services/api/runnersApi';
import type { Runner } from '../../types';
import type { RunnerFilters, GroupRegistrationData } from '../../services/api/runnersApi';

export const useRunners = (initialFilters: RunnerFilters = {}) => {
  const [runners, setRunners] = useState<Runner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchRunners = useCallback(async (filters: RunnerFilters = initialFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await runnersApi.getRunners(filters);
      setRunners(result.runners);
      setPagination(result.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando corredores';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const registerGroup = async (groupData: GroupRegistrationData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await runnersApi.registerGroup(groupData);
      // Refrescar lista después del registro
      await fetchRunners();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error registrando grupo';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRunner = async (id: string, force: boolean = false) => {
    setLoading(true);
    setError(null);
    
    try {
      await runnersApi.deleteRunner(id, force);
      // Refrescar lista después de eliminar
      await fetchRunners();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error eliminando corredor';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportRunners = async (filters: RunnerFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const blob = await runnersApi.exportRunners(filters);
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `corredores_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error exportando corredores';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchRunners(initialFilters);
  }, [fetchRunners]);

  return {
    runners,
    loading,
    error,
    pagination,
    fetchRunners,
    registerGroup,
    deleteRunner,
    exportRunners,
    refetch: () => fetchRunners()
  };
};

export const useRunnerDetails = (runnerId: string | null) => {
  const [runner, setRunner] = useState<Runner | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRunner = useCallback(async () => {
    if (!runnerId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await runnersApi.getRunnerById(runnerId);
      setRunner(result.runner);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando corredor';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [runnerId]);

  const updateRunner = async (updates: Partial<Runner>) => {
    if (!runnerId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const updatedRunner = await runnersApi.updateRunner(runnerId, updates);
      setRunner(updatedRunner);
      return updatedRunner;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando corredor';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRunner();
  }, [fetchRunner]);

  return {
    runner,
    loading,
    error,
    updateRunner,
    refetch: fetchRunner
  };
};