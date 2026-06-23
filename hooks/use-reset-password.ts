import { useMutation } from '@tanstack/react-query';

import { resetPassword } from '@/services/user.service';
import type { ResetPasswordRequest } from '@/types/user.types';

export function useResetPassword() {
  return useMutation<void, Error, ResetPasswordRequest>({
    mutationFn: (data) => resetPassword(data),
  });
}
