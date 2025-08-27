// src/services/api/apiClient.ts - Cliente API centralizado
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:30500';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultRetries: number;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultTimeout = 30000; // 30 segundos
    this.defaultRetries = 3;
  }

  private async request<T>(
    endpoint: string, 
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      ...fetchConfig
    } = config;

    const url = `${this.baseURL}${endpoint}`;
    
    // Configurar headers por defecto
    const headers = {
      'Content-Type': 'application/json',
      ...fetchConfig.headers
    };

    // Agregar token de autenticación si existe
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  // Método para uploads
  async upload<T>(endpoint: string, formData: FormData, config?: RequestConfig): Promise<ApiResponse<T>> {
    const { headers, ...restConfig } = config || {};
    
    // No establecer Content-Type para FormData (el browser lo hace automáticamente)
    const uploadHeaders = { ...headers };
    delete uploadHeaders['Content-Type'];

    const token = localStorage.getItem('token');
    if (token) {
      uploadHeaders['Authorization'] = `Bearer ${token}`;
    }

    return this.request<T>(endpoint, {
      ...restConfig,
      method: 'POST',
      headers: uploadHeaders,
      body: formData
    });
  }
}

// Instancia singleton
export const apiClient = new ApiClient();

// Función helper para manejar errores de API
export const handleApiError = (error: any): string => {
  if (error.message) return error.message;
  if (typeof error === 'string') return error;
  return 'Error desconocido';
};

// Función helper para verificar si una respuesta es exitosa
export const isApiSuccess = <T>(response: ApiResponse<T>): response is ApiResponse<T> & { data: T } => {
  return response.success === true && response.data !== undefined;
};