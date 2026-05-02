import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ROUTE_ABSENCES_QUERY_KEY } from '@/hooks/use-route-absences';
import { ROUTE_DETAIL_QUERY_KEY } from '@/hooks/use-route-detail';
import { ROUTE_PASSANGERS_QUERY_KEY } from '@/hooks/use-route-passangers';
import { removePassanger } from '@/services/route.service';

type RemovePassangerVariables = {
  routeId: string;
  rpId: string;
};

export function useRemovePassanger() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ routeId, rpId }: RemovePassangerVariables) => removePassanger(routeId, rpId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ROUTE_DETAIL_QUERY_KEY(variables.routeId) });
      queryClient.invalidateQueries({ queryKey: ROUTE_PASSANGERS_QUERY_KEY(variables.routeId) });
      queryClient.invalidateQueries({ queryKey: ROUTE_ABSENCES_QUERY_KEY(variables.routeId) });
    },
  });
}
