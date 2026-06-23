import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useSessionStore } from '@/store/session.store';
import { logoutUser } from '@/services/user.service';
import { useDeleteUser } from '@/hooks/use-delete-user';

export function useAccountActions() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearSession = useSessionStore((state) => state.clearSession);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

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
      queryClient.clear();
      router.dismissAll();
      router.replace('/onboarding');
    }
  };

  const handleDeleteAccount = () => {
    deleteUser(undefined, {
      onSuccess: () => {
        clearSession();
        queryClient.clear();
        router.dismissAll();
        router.replace('/onboarding');
      },
      onError: () => {
        Alert.alert('Erro', 'Não foi possível excluir a conta. Tente novamente.');
      },
    });
  };

  return {
    handleLogout,
    handleDeleteAccount,
    isLoggingOut,
    isDeleting,
  };
}
