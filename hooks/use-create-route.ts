import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createRoute } from '@/services/route.service';
import { DRIVER_ROUTES_QUERY_KEY } from '@/hooks/use-driver-routes';
import type { CreateRouteRequest } from '@/types/route.types';

export function useCreateRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRouteRequest) => createRoute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DRIVER_ROUTES_QUERY_KEY });
    },
  });
}
