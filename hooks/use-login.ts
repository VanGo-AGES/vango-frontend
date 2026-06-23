import { useMutation } from '@tanstack/react-query';

import { loginUser } from '@/services/user.service';
import { useSessionStore } from '@/store/session.store';
import type { LoginRequest, LoginResponse } from '@/types/user.types';

export function useLogin() {
  const setUser = useSessionStore((s) => s.setUser);
  const setTokens = useSessionStore((s) => s.setTokens);

  return useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: (data) => loginUser(data),
    onSuccess: (response) => {
      // 1. Salva os tokens no AsyncStorage
      setTokens(response.access_token, response.refresh_token);

      // 2. Salva o usuário no AsyncStorage
      setUser({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        phone: response.user.phone,
        cpf: response.user.cpf,
        role: response.user.role,
        photo_url: response.user.photo_url,
      });
    },
  });
}
