// src/hooks/api/useInventory.ts - Hook para operaciones de inventario
import { useState, useEffect, useCallback } from 'react';
import { inventoryApi } from '../../services/api/inventoryApi';
import type { Inventory } from '../../types';
import type { InventoryUpdate } from '../../services/api/inventoryApi';

export const useInventory = () => {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await inventoryApi.getInventory();
      setInventory(Array.isArray(result) ? result : []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando inventario';
      setError(errorMessage);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const result = await inventoryApi.getInventorySummary();
      setStats(result);
    } catch (err) {
      console.error('Error cargando estadísticas de inventario:', err);
    }
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      const result = await inventoryApi.getInventoryAlerts();
      setAlerts(Array.isArray(result?.alerts) ? result.alerts : []);
    } catch (err) {
      console.error('Error cargando alertas de inventario:', err);
      setAlerts([]);
    }
  }, []);

  const updateInventory = async (updates: InventoryUpdate[]) => {
    setLoading(true);
    setError(null);
    
    try {
      await inventoryApi.updateInventory(updates);
      // Refrescar datos después de actualizar
      await Promise.all([fetchInventory(), fetchStats(), fetchAlerts()]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando inventario';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const recalculateReserved = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await inventoryApi.recalculateReserved();
      // Refrescar datos después de recalcular
      await Promise.all([fetchInventory(), fetchStats()]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error recalculando reservas';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función helper para obtener stock disponible
  const getAvailableStock = useCallback((size: string, gender: string): number => {
    if (!Array.isArray(inventory) || inventory.length === 0) {
      return 0;
    }
    
    const item = inventory.find(inv => 
      inv.shirt_size === size && inv.gender === gender
    );
    
    return item?.available ?? 0;
  }, [inventory]);

  // Cargar datos iniciales
  useEffect(() => {
    Promise.all([
      fetchInventory(),
      fetchStats(),
      fetchAlerts()
    ]);
  }, [fetchInventory, fetchStats, fetchAlerts]);

  return {
    inventory,
    stats,
    alerts,
    loading,
    error,
    updateInventory,
    recalculateReserved,
    getAvailableStock,
    refetch: () => Promise.all([fetchInventory(), fetchStats(), fetchAlerts()])
  };
};