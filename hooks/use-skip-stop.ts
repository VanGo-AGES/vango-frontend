import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TRIP_NEXT_STOP_QUERY_KEY } from '@/hooks/use-trip-next-stop';
import { TRIP_QUERY_KEY } from '@/hooks/use-trip';
import { skipStop } from '@/services/trip.service';
import type { TripPassangerResponse } from '@/types/trip.types';

type SkipStopVariables = {
  tripId: string;
  stopId: string;
};

export function useSkipStop() {
  const queryClient = useQueryClient();

  return useMutation<TripPassangerResponse[], unknown, SkipStopVariables>({
    mutationFn: ({ tripId, stopId }: SkipStopVariables) => skipStop(tripId, stopId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEY(variables.tripId) });
      queryClient.invalidateQueries({ queryKey: TRIP_NEXT_STOP_QUERY_KEY(variables.tripId) });
    },
  });
}
