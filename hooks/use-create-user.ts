import { useMutation } from '@tanstack/react-query';

import { createUser } from '@/services/user.service';
import type { CreateUserRequest } from '@/types/user.types';

export function useCreateUser() {
  return useMutation({
    mutationFn: (data: CreateUserRequest) => createUser(data),
  });
}
