import axios from 'axios';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';

const API_BASE = '/api/auth';

export const authService = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_BASE}/register`, data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_BASE}/login`, data);
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  saveAuth: (authResponse: AuthResponse): void => {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('user', JSON.stringify({
      name: authResponse.name,
      email: authResponse.email,
      role: authResponse.role,
    }));
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('token');
  },
};
