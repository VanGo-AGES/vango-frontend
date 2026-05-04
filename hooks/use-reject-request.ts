import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ROUTE_PASSANGERS_QUERY_KEY } from '@/hooks/use-route-passangers';
import { rejectRequest } from '@/services/route-passanger.service';

type RejectRequestVariables = {
  routeId: string;
  rpId: string;
};

export function useRejectRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ routeId, rpId }: RejectRequestVariables) => rejectRequest(routeId, rpId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ROUTE_PASSANGERS_QUERY_KEY(variables.routeId) });
    },
  });
}
