import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateUser } from '@/services/user.service';
import type { UpdateUserRequest } from '@/types/user.types';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) => updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });
}
