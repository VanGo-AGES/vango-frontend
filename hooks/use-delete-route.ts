import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DRIVER_ROUTES_QUERY_KEY } from '@/hooks/use-driver-routes';
import { deleteRoute } from '@/services/route.service';

export function useDeleteRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (routeId: string) => deleteRoute(routeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DRIVER_ROUTES_QUERY_KEY });
    },
  });
}
