// src/hooks/api/usePayments.ts - Hook para operaciones de pagos
import { useState, useEffect, useCallback } from 'react';
import { paymentsApi } from '../../services/api/paymentsApi';
import type { PaymentFilters, PaymentConfirmation, PaymentRejection } from '../../services/api/paymentsApi';

export const usePayments = (initialFilters: PaymentFilters = {}) => {
  const [groups, setGroups] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchPaymentGroups = useCallback(async (filters: PaymentFilters = initialFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await paymentsApi.getPaymentGroups(filters);
      setGroups(result.groups);
      setPagination(result.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando grupos de pago';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPaymentTransactions = useCallback(async (filters: PaymentFilters = initialFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await paymentsApi.getPaymentTransactions(filters);
      setTransactions(result.transactions);
      setPagination(result.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando transacciones';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPaymentStats = useCallback(async () => {
    try {
      const result = await paymentsApi.getPaymentStats();
      setStats(result);
    } catch (err) {
      console.error('Error cargando estadísticas de pagos:', err);
    }
  }, []);

  const confirmPayment = async (groupId: string, data: PaymentConfirmation) => {
    setLoading(true);
    setError(null);
    
    try {
      await paymentsApi.confirmGroupPayment(groupId, data);
      // Refrescar datos después de confirmar
      await fetchPaymentGroups();
      await fetchPaymentStats();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error confirmando pago';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectPayment = async (groupId: string, data: PaymentRejection) => {
    setLoading(true);
    setError(null);
    
    try {
      await paymentsApi.rejectGroupPayment(groupId, data);
      // Refrescar datos después de rechazar
      await fetchPaymentGroups();
      await fetchPaymentStats();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error rechazando pago';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchPaymentGroups(initialFilters);
    fetchPaymentStats();
  }, [fetchPaymentGroups, fetchPaymentStats]);

  return {
    groups,
    transactions,
    stats,
    loading,
    error,
    pagination,
    fetchPaymentGroups,
    fetchPaymentTransactions,
    confirmPayment,
    rejectPayment,
    refetch: () => {
      fetchPaymentGroups();
      fetchPaymentStats();
    }
  };
};

export const usePaymentStatus = (control: string | null) => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    if (!control) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await paymentsApi.getPaymentStatus(control);
      setStatus(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error verificando estado';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [control]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return {
    status,
    loading,
    error,
    checkStatus
  };
};