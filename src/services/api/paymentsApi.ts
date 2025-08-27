// src/services/api/paymentsApi.ts - Servicio API de pagos
import { apiClient, handleApiError } from './apiClient';

export interface PaymentFilters {
  status?: string;
  payment_method?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaymentConfirmation {
  reference?: string;
  notes?: string;
}

export interface PaymentRejection {
  reason: string;
}

export const paymentsApi = {
  // Obtener grupos de pago
  async getPaymentGroups(filters: PaymentFilters = {}): Promise<{
    groups: any[];
    pagination?: any;
  }> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const endpoint = `/api/payments/groups${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await apiClient.get<{
        groups: any[];
        pagination?: any;
      }>(endpoint);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error obteniendo grupos de pago');
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener transacciones de pago
  async getPaymentTransactions(filters: PaymentFilters = {}): Promise<{
    transactions: any[];
    pagination?: any;
  }> {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });

      const endpoint = `/api/payments${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await apiClient.get<{
        transactions: any[];
        pagination?: any;
      }>(endpoint);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error obteniendo transacciones');
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Confirmar pago de grupo
  async confirmGroupPayment(groupId: string, data: PaymentConfirmation): Promise<void> {
    try {
      const response = await apiClient.put(`/api/payments/group/${groupId}/confirm`, data);
      
      if (!response.success) {
        throw new Error(response.message || 'Error confirmando pago');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Rechazar pago de grupo
  async rejectGroupPayment(groupId: string, data: PaymentRejection): Promise<void> {
    try {
      const response = await apiClient.put(`/api/payments/group/${groupId}/reject`, data);
      
      if (!response.success) {
        throw new Error(response.message || 'Error rechazando pago');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener estadísticas de pagos
  async getPaymentStats(): Promise<any> {
    try {
      const response = await apiClient.get('/api/payments/stats/summary');
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error obteniendo estadísticas');
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Obtener estado de pago por control
  async getPaymentStatus(control: string): Promise<any> {
    try {
      const response = await apiClient.get(`/api/payment-gateway/payment-status/${control}`);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Error obteniendo estado de pago');
      }

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};