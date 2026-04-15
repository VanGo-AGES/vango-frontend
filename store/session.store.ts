import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { UserRole } from '@/types/user.types';

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string | null;
  role: UserRole;
  photo_url: string | null;
};

type SessionState = {
  user: SessionUser | null;
  localPhotoUri: string | null;
  setUser: (user: SessionUser) => void;
  updateUser: (data: Partial<Omit<SessionUser, 'id' | 'role'>>) => void;
  setLocalPhotoUri: (uri: string | null) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      localPhotoUri: null,
      setUser: (user) => set({ user }),
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
      setLocalPhotoUri: (uri) => set({ localPhotoUri: uri }),
      clearSession: () => set({ user: null, localPhotoUri: null }),
    }),
    {
      name: 'session-v2', // bump de versão: invalida sessões antigas com shape { driver: ... }
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
