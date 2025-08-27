// src/services/api/runnersApi.ts - Servicio API de corredores
import { apiClient, handleApiError } from './apiClient';
import type { Runner, RegistrationGroup } from '../../types';

export interface RunnerFilters {
  payment_status?: string;
  payment_method?: string;
  shirt_size?: string;
  gender?: string;
  search?: string;
  group_id?: string;
  has_number?: string;
  registered_by?: string;
  page?: number;
  limit?: number;
}

export interface GroupRegistrationData {
  registrant_email: string;
  registrant_phone: string;
  registrant_identification_type: string;
  registrant_identification: string;
  payment_method: string;
  payment_reference?: string;
  payment_proof_url?: string;
  runners: Array<{
    full_name: string;
    identification_type: string;
    identification: string;
    birth_date: string;
    gender: string;
    email: string;
    phone: string;
    shirt_size: string;
  }>;
  store_payment?: boolean;
  auto_confirm?: boolean;
  is_gift?: boolean;
  employee_id?: string;
  gift_reason?: string;
}

export const runnersApi = {
  // Obtener lista de corredores
  async getRunners(filters: RunnerFilters = {}): Promise<{
    runners: Runner[];
    pagination: any;
  }> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const endpoint = `/api/runners${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await apiClient.get<{
        runners: Runner[];
        pagination: any;
      }>(endpoint);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error obteniendo corredores');
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Registrar grupo de corredores
  async registerGroup(groupData: GroupRegistrationData): Promise<{
    group: RegistrationGroup;
  }> {
    try {
      const response = await apiClient.post<{ group: RegistrationGroup }>(
        '/api/runners/register-group',
        groupData
      );
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error registrando grupo');
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener corredor por ID
  async getRunnerById(id: string): Promise<{ runner: Runner }> {
    try {
      const response = await apiClient.get<{ runner: Runner }>(`/api/runners/${id}`);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Corredor no encontrado');
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Actualizar corredor
  async updateRunner(id: string, updates: Partial<Runner>): Promise<Runner> {
    try {
      const response = await apiClient.put<{ runner: Runner }>(`/api/runners/${id}`, updates);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error actualizando corredor');
      }

      return response.data.runner;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Eliminar corredor
  async deleteRunner(id: string, force: boolean = false): Promise<void> {
    try {
      const endpoint = `/api/runners/${id}${force ? '?force=true' : ''}`;
      const response = await apiClient.delete(endpoint);
      
      if (!response.success) {
        throw new Error(response.message || 'Error eliminando corredor');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Eliminar grupo completo
  async deleteGroup(groupId: string, force: boolean = false): Promise<void> {
    try {
      const endpoint = `/api/runners/groups/${groupId}${force ? '?force=true' : ''}`;
      const response = await apiClient.delete(endpoint);
      
      if (!response.success) {
        throw new Error(response.message || 'Error eliminando grupo');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Exportar corredores
  async exportRunners(filters: RunnerFilters = {}): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const endpoint = `/api/runners/export${queryParams.toString() ? `?${queryParams}` : ''}`;
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error exportando corredores');
      }

      return await response.blob();
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Enviar email de confirmación
  async triggerConfirmationEmail(groupId: string): Promise<void> {
    try {
      const response = await apiClient.post(`/api/runners/groups/${groupId}/trigger-confirmation-email`);
      
      if (!response.success) {
        throw new Error(response.message || 'Error enviando email');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};