// TypeScript interfaces shared across the app

export interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  coverUrl: string;
  category: string;
  stock: number;
  rating: number;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  role: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiError {
  error: string;
}
