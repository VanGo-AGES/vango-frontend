import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ROUTE_DETAIL_QUERY_KEY } from '@/hooks/use-route-detail';
import { ROUTE_PASSANGERS_QUERY_KEY } from '@/hooks/use-route-passangers';
import { acceptRequest } from '@/services/route-passanger.service';

type AcceptRequestVariables = {
  routeId: string;
  rpId: string;
};

export function useAcceptRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ routeId, rpId }: AcceptRequestVariables) => acceptRequest(routeId, rpId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ROUTE_PASSANGERS_QUERY_KEY(variables.routeId) });
      queryClient.invalidateQueries({ queryKey: ROUTE_DETAIL_QUERY_KEY(variables.routeId) });
    },
  });
}
