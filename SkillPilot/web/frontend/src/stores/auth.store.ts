import { create } from 'zustand';
import { authAPI } from '@/lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'recruiter';
  avatar?: string;
  bio?: string;
  skills: string[];
  university?: string;
  github?: string;
  linkedin?: string;
  skillScore?: number;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const data = await authAPI.login({ email, password });
    set({ user: data.user, isAuthenticated: true });
  },

  signup: async (name: string, email: string, password: string, role: string) => {
    const data = await authAPI.signup({ name, email, password, role });
    set({ user: data.user, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // ignore
    }
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const data = await authAPI.me();
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user: User) => set({ user }),
}));
