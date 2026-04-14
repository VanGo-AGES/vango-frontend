import { useMutation } from '@tanstack/react-query';

import { updateUser } from '@/services/user.service';
import type { UpdateUserRequest } from '@/types/user.types';

type UpdateUserParams = {
  userId: string;
  data: UpdateUserRequest;
};

export function useUpdateUser() {
  return useMutation({
    mutationFn: ({ userId, data }: UpdateUserParams) => updateUser(userId, data),
  });
}
