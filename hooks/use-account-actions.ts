import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useSessionStore } from '@/store/session.store';
import { logoutUser } from '@/services/user.service';

export function useAccountActions() {
  const router = useRouter();
  const clearSession = useSessionStore((state) => state.clearSession);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logoutUser();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('[logout] failed to revoke token on server:', error);
    } finally {
      clearSession();
      router.dismissAll();
      router.replace('/onboarding');
    }
  };

  const handleDeleteAccount = async () => {
    // TODO: implementar lógica de exclusão de conta no backend na Sprint 4
    clearSession();
    router.dismissAll();
    router.replace('/onboarding');
  };

  return {
    handleLogout,
    handleDeleteAccount,
    isLoggingOut,
  };
}
