import { useMutation } from '@tanstack/react-query';

import { requestPasswordReset } from '@/services/user.service';
import type { ForgotPasswordRequest } from '@/types/user.types';

export function useForgotPassword() {
  return useMutation<void, Error, ForgotPasswordRequest>({
    mutationFn: (data) => requestPasswordReset(data),
  });
}
