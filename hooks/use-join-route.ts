import { useMutation, useQueryClient } from '@tanstack/react-query';
import { joinRoute } from '@/services/route-passanger.service';
import { PASSANGER_ROUTES_QUERY_KEY } from '@/hooks/use-passanger-routes';
import type { JoinRouteRequest } from '@/types/route.types';

export function useJoinRoute(routeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: JoinRouteRequest) => joinRoute(routeId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: PASSANGER_ROUTES_QUERY_KEY });
    },
  });
}
