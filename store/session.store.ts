import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Driver = {
  id: string;
  name: string;
  token: string;
};

type SessionState = {
  driver: Driver | null;
  setDriver: (driver: Driver) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      driver: null,
      setDriver: (driver) => set({ driver }),
      clearSession: () => set({ driver: null }),
    }),
    {
      name: 'session',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
