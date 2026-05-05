import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DRIVER_ROUTES_QUERY_KEY } from '@/hooks/use-driver-routes';
import { updateRoute } from '@/services/route.service';
import type { RouteUpdate } from '@/types/route.types';

export function useUpdateRoute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RouteUpdate }) => updateRoute(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['route', id] });
      queryClient.invalidateQueries({ queryKey: DRIVER_ROUTES_QUERY_KEY });
    },
  });
}
