import { useMutation } from '@tanstack/react-query';
import { deleteMyAccount } from '../services/user.service';

export function useDeleteUser() {
  return useMutation({
    mutationFn: () => deleteMyAccount(),
  });
}
