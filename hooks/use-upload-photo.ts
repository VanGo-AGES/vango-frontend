import { useMutation } from '@tanstack/react-query';

import { uploadPhoto } from '@/services/user.service';

export function useUploadPhoto() {
  return useMutation({
    mutationFn: (uri: string) => uploadPhoto(uri),
  });
}
