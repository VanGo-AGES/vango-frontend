import { useMutation } from '@tanstack/react-query';

import { loginUser } from '@/services/user.service';
import { useSessionStore } from '@/store/session.store';
import type { LoginRequest, LoginResponse } from '@/types/user.types';

export function useLogin() {
  const setUser = useSessionStore((s) => s.setUser);

  return useMutation<LoginResponse, unknown, LoginRequest>({
    mutationFn: (data) => loginUser(data),
    onSuccess: (response) => {
      setUser({
        id: response.id,
        name: response.name,
        email: response.email,
        phone: response.phone,
        cpf: response.cpf,
        role: response.role,
        photo_url: response.photo_url,
      });
    },
  });
}
