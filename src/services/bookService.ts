import axios from 'axios';
import { Book } from '../types';
import { authService } from './authService';

const API_BASE = '/api/books';

// Create axios instance with auth headers
const authAxios = axios.create();
authAxios.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const bookService = {
  getAllBooks: async (): Promise<Book[]> => {
    const response = await axios.get<Book[]>(API_BASE);
    return response.data;
  },

  getBookById: async (id: string): Promise<Book> => {
    const response = await axios.get<Book>(`${API_BASE}/${id}`);
    return response.data;
  },

  searchBooks: async (query: string): Promise<Book[]> => {
    const response = await axios.get<Book[]>(`${API_BASE}/search`, {
      params: { q: query },
    });
    return response.data;
  },

  getByCategory: async (category: string): Promise<Book[]> => {
    const response = await axios.get<Book[]>(`${API_BASE}/category/${category}`);
    return response.data;
  },

  createBook: async (book: Omit<Book, 'id'>): Promise<Book> => {
    const response = await authAxios.post<Book>(API_BASE, book);
    return response.data;
  },
};
