import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'donor' | 'ngo' | 'volunteer' | 'admin';
  avatar_url?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
  is_verified: boolean;
  created_at?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

interface RegisterData {
  email: string;
  name: string;
  password: string;
  role: string;
  phone?: string;
  city?: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(error.response?.data?.detail || 'Login failed');
        }
      },

      register: async (registerData: RegisterData) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/register', registerData);
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(error.response?.data?.detail || 'Registration failed');
        }
      },

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, isAuthenticated: false });
      },

      fetchUser: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data, isAuthenticated: true });
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },

      updateUser: async (updateData: Partial<User>) => {
        const { data } = await api.put('/auth/me', updateData);
        set({ user: data });
      },
    }),
    {
      name: 'foodbridge-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
