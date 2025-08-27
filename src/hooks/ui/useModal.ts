// src/hooks/ui/useModal.ts - Hook para manejo de modales
import { useState, useCallback } from 'react';

export interface ModalState {
  isOpen: boolean;
  data?: any;
  type?: string;
}

export const useModal = (initialState: ModalState = { isOpen: false }) => {
  const [modalState, setModalState] = useState<ModalState>(initialState);

  const openModal = useCallback((data?: any, type?: string) => {
    setModalState({
      isOpen: true,
      data,
      type
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      data: null,
      type: undefined
    });
  }, []);

  const updateModalData = useCallback((data: any) => {
    setModalState(prev => ({
      ...prev,
      data
    }));
  }, []);

  return {
    isOpen: modalState.isOpen,
    data: modalState.data,
    type: modalState.type,
    openModal,
    closeModal,
    updateModalData
  };
};

// Hook específico para modales de confirmación
export const useConfirmationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }>({});

  const showConfirmation = useCallback((newConfig: typeof config) => {
    setConfig(newConfig);
    setIsOpen(true);
  }, []);

  const hideConfirmation = useCallback(() => {
    setIsOpen(false);
    setConfig({});
  }, []);

  const handleConfirm = useCallback(async () => {
    if (config.onConfirm) {
      await config.onConfirm();
    }
    hideConfirmation();
  }, [config.onConfirm, hideConfirmation]);

  const handleCancel = useCallback(() => {
    if (config.onCancel) {
      config.onCancel();
    }
    hideConfirmation();
  }, [config.onCancel, hideConfirmation]);

  return {
    isOpen,
    config,
    showConfirmation,
    hideConfirmation,
    handleConfirm,
    handleCancel
  };
};