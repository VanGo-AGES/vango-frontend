import { useRouter } from 'expo-router';
import { useSessionStore } from '@/store/session.store';

export function useAccountActions() {
  const router = useRouter();
  const clearSession = useSessionStore((state) => state.clearSession);

  const handleLogout = async () => {
    clearSession();
    router.dismissAll();
    router.replace('/onboarding');
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
  };
}
