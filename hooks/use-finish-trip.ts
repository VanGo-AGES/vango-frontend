import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DRIVER_ROUTES_QUERY_KEY } from '@/hooks/use-driver-routes';
import { ROUTE_DETAIL_QUERY_KEY } from '@/hooks/use-route-detail';
import { TRIP_NEXT_STOP_QUERY_KEY } from '@/hooks/use-trip-next-stop';
import { TRIP_QUERY_KEY } from '@/hooks/use-trip';
import { finishTrip } from '@/services/trip.service';
import type { FinishTripRequest, TripResponse } from '@/types/trip.types';

type FinishTripVariables = {
  tripId: string;
  routeId: string;
  data?: FinishTripRequest;
};

export function useFinishTrip() {
  const queryClient = useQueryClient();

  return useMutation<TripResponse, unknown, FinishTripVariables>({
    mutationFn: ({ tripId, data }: FinishTripVariables) =>
      finishTrip(tripId, data ?? { total_km: null }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEY(variables.tripId) });
      queryClient.invalidateQueries({ queryKey: TRIP_NEXT_STOP_QUERY_KEY(variables.tripId) });
      queryClient.invalidateQueries({ queryKey: DRIVER_ROUTES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ROUTE_DETAIL_QUERY_KEY(variables.routeId) });
    },
  });
}
