import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DRIVER_ROUTES_QUERY_KEY } from '@/hooks/use-driver-routes';
import { ROUTE_DETAIL_QUERY_KEY } from '@/hooks/use-route-detail';
import { startTrip } from '@/services/trip.service';
import type { StartTripRequest, TripResponse } from '@/types/trip.types';

type StartTripVariables = {
  routeId: string;
  data: StartTripRequest;
};

export function useStartTrip() {
  const queryClient = useQueryClient();

  return useMutation<TripResponse, unknown, StartTripVariables>({
    mutationFn: ({ routeId, data }: StartTripVariables) => startTrip(routeId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: DRIVER_ROUTES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ROUTE_DETAIL_QUERY_KEY(variables.routeId) });
    },
  });
}
