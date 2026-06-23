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
  accessToken: string | null;
  refreshToken: string | null;
  localPhotoUri: string | null;
  hasHydrated: boolean;
  setUser: (user: SessionUser) => void;
  setTokens: (accessToken: string, refreshToken: string | null) => void;
  updateUser: (data: Partial<Omit<SessionUser, 'id' | 'role'>>) => void;
  setLocalPhotoUri: (uri: string | null) => void;
  setHasHydrated: (value: boolean) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      localPhotoUri: null,
      hasHydrated: false,
      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
      setLocalPhotoUri: (uri) => set({ localPhotoUri: uri }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
      clearSession: () =>
        set({ user: null, accessToken: null, refreshToken: null, localPhotoUri: null }),
    }),
    {
      name: 'session-v3',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
