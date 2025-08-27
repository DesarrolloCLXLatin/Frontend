// src/hooks/forms/useFormValidation.ts - Hook para validación de formularios
import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  type?: 'email' | 'phone' | 'number' | 'date';
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((name: string, value: any): string | null => {
    const rule = rules[name];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return 'Este campo es requerido';
    }

    // Skip other validations if field is empty and not required
    if (!value && !rule.required) return null;

    // Type validations
    if (rule.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Email inválido';
      }
    }

    if (rule.type === 'phone') {
      const phoneRegex = /^[0-9\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) {
        return 'Teléfono inválido';
      }
    }

    if (rule.type === 'number') {
      if (isNaN(Number(value))) {
        return 'Debe ser un número válido';
      }
    }

    if (rule.type === 'date') {
      if (isNaN(Date.parse(value))) {
        return 'Fecha inválida';
      }
    }

    // Length validations
    if (rule.minLength && value.length < rule.minLength) {
      return `Mínimo ${rule.minLength} caracteres`;
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return `Máximo ${rule.maxLength} caracteres`;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return 'Formato inválido';
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [rules]);

  const validateForm = useCallback((formData: Record<string, any>): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [rules, validateField]);

  const validateSingleField = useCallback((name: string, value: any): boolean => {
    const error = validateField(name, value);
    
    setErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));

    return !error;
  }, [validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  }, []);

  const hasErrors = Object.values(errors).some(error => error);

  return {
    errors,
    validateForm,
    validateSingleField,
    clearErrors,
    clearFieldError,
    hasErrors
  };
};

// Reglas de validación comunes
export const commonValidationRules = {
  email: {
    required: true,
    type: 'email' as const,
    maxLength: 255
  },
  
  password: {
    required: true,
    minLength: 6,
    maxLength: 128
  },
  
  phone: {
    required: true,
    type: 'phone' as const,
    minLength: 10,
    maxLength: 15
  },
  
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  },
  
  identification: {
    required: true,
    minLength: 6,
    maxLength: 20,
    pattern: /^[0-9]+$/
  },
  
  birthDate: {
    required: true,
    type: 'date' as const,
    custom: (value: string) => {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 12) return 'Debe tener al menos 12 años';
      if (age > 100) return 'Edad inválida';
      return null;
    }
  }
};