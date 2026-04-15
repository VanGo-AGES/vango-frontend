import { useMutation } from '@tanstack/react-query';

import { createRoute } from '@/services/route.service';
import type { CreateRouteRequest } from '@/types/route.types';

export function useCreateRoute() {
  return useMutation({
    mutationFn: (data: CreateRouteRequest) => createRoute(data),
  });
}
