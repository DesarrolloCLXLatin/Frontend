// src/services/api/inventoryApi.ts - Servicio API de inventario
import { apiClient, handleApiError } from './apiClient';
import type { Inventory } from '../../types';

export interface InventoryUpdate {
  shirt_size: string;
  gender: string;
  stock: number;
}

export const inventoryApi = {
  // Obtener inventario completo
  async getInventory(): Promise<Inventory[]> {
    try {
      const response = await apiClient.get<{ data: Inventory[] } | Inventory[]>('/api/inventory');
      
      if (!response.success) {
        throw new Error(response.message || 'Error obteniendo inventario');
      }

      // Manejar diferentes formatos de respuesta
      let inventoryData: Inventory[] = [];
      
      if (response.data) {
        if (Array.isArray(response.data)) {
          inventoryData = response.data;
        } else if ('data' in response.data && Array.isArray(response.data.data)) {
          inventoryData = response.data.data;
        }
      }

      return inventoryData;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Actualizar inventario
  async updateInventory(updates: InventoryUpdate[]): Promise<void> {
    try {
      const response = await apiClient.put('/api/inventory', { updates });
      
      if (!response.success) {
        throw new Error(response.message || 'Error actualizando inventario');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener resumen de inventario
  async getInventorySummary(): Promise<any> {
    try {
      const response = await apiClient.get('/api/inventory/summary');
      
      if (!response.success) {
        throw new Error(response.message || 'Error obteniendo resumen');
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener alertas de inventario
  async getInventoryAlerts(): Promise<any> {
    try {
      const response = await apiClient.get('/api/inventory/alerts');
      
      if (!response.success) {
        throw new Error(response.message || 'Error obteniendo alertas');
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Recalcular reservas
  async recalculateReserved(): Promise<void> {
    try {
      const response = await apiClient.post('/api/inventory/recalculate-reserved');
      
      if (!response.success) {
        throw new Error(response.message || 'Error recalculando reservas');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};