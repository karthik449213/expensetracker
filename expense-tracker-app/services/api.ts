/**
 * API Service Layer
 * Handles all HTTP communication with the backend
 */

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface Expense {
  _id: string;
  userId: string;
  amount: number;
  category: string;
  date: string;
  note: string;
  paymentMethod: string;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpensePayload {
  amount: number;
  category: string;
  date: string;
  note: string;
  paymentMethod: string;
  isRecurring?: boolean;
}

export interface ExpenseResponse {
  success: boolean;
  message: string;
  expense?: Expense;
  expenses?: Expense[];
  data?: {
    expenses: Expense[];
    total: number;
    pages: number;
    currentPage: number;
  };
}

export interface SummaryResponse {
  success: boolean;
  summary: {
    totalExpense: number;
    thisMonth: number;
    thisWeek: number;
    categorySummary: { [key: string]: number };
    topCategories: Array<{ category: string; amount: number }>;
    monthlyTrend?: Array<{ month: string; amount: number }>;
  };
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}

// Create axios instance
// Use 127.0.0.1 instead of localhost for Expo compatibility
const API_BASE_URL = 'http://172.16.31.82:5000/api'; // Production (update with your production URL)

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
let isRefreshing =false;
let failedQueue:Array<{
     onSucess: (token:string) =>void;
    onFailed: (error : AxiosError)  =>void;
   }> =[];
   const processQueue =(error:AxiosError | null,token:string |null =null)=>{
    failedQueue.forEach(prom=>{
      if(error){
        prom.onFailed(error);
      }
        else{
          prom.onSucess(token!);

        }
      
    });
   }
apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((onSuccess, onFailed) => {
          failedQueue.push({ onSuccess, onFailed });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(
            `${API_BASE_URL}/api/auth/refresh-token`,
            { refreshToken }
          );
          
          await AsyncStorage.setItem('authToken', data.token);
          if (data.refreshToken) {
            await AsyncStorage.setItem('refreshToken', data.refreshToken);
          }

          apiClient.defaults.headers['Authorization'] = `Bearer ${data.token}`;
          originalRequest.headers['Authorization'] = `Bearer ${data.token}`;

          processQueue(null, data.token);
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('refreshToken');
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Authentication API calls
 */
export const authAPI = {
  register: async (
    email: string,
    password: string,
    username: string,
    firstName: string,
    lastName: string
  ): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      username,
      firstName,
      lastName,
    });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  getCurrentUser: async (): Promise<{ success: boolean; user: User }> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

/**
 * Expense API calls
 */
export const expenseAPI = {
  createExpense: async (
    payload: CreateExpensePayload
  ): Promise<ExpenseResponse> => {
    const response = await apiClient.post('/expenses', payload);
    return response.data;
  },

  getExpenses: async (
    category?: string,
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ExpenseResponse> => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await apiClient.get(`/expenses?${params.toString()}`);
    return response.data;
  },

  getExpenseById: async (id: string): Promise<ExpenseResponse> => {
    const response = await apiClient.get(`/expenses/${id}`);
    return response.data;
  },

  updateExpense: async (
    id: string,
    payload: Partial<CreateExpensePayload>
  ): Promise<ExpenseResponse> => {
    const response = await apiClient.put(`/expenses/${id}`, payload);
    return response.data;
  },

  deleteExpense: async (id: string): Promise<ExpenseResponse> => {
    const response = await apiClient.delete(`/expenses/${id}`);
    return response.data;
  },

  getSummary: async (): Promise<SummaryResponse> => {
    const response = await apiClient.get('/expenses/summary');
    return response.data;
  },

  getMonthlyTrend: async (): Promise<SummaryResponse> => {
    const response = await apiClient.get('/expenses/summary');
    return response.data;
  },
};

export default apiClient;
