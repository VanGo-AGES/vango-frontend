import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TRIP_NEXT_STOP_QUERY_KEY } from '@/hooks/use-trip-next-stop';
import { TRIP_QUERY_KEY } from '@/hooks/use-trip';
import { boardPassanger } from '@/services/trip.service';
import type { TripPassangerResponse } from '@/types/trip.types';

type BoardPassangerVariables = {
  tripId: string;
  tripPassangerId: string;
};

export function useBoardPassanger() {
  const queryClient = useQueryClient();

  return useMutation<TripPassangerResponse, unknown, BoardPassangerVariables>({
    mutationFn: ({ tripId, tripPassangerId }: BoardPassangerVariables) =>
      boardPassanger(tripId, tripPassangerId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEY(variables.tripId) });
      queryClient.invalidateQueries({ queryKey: TRIP_NEXT_STOP_QUERY_KEY(variables.tripId) });
    },
  });
}
