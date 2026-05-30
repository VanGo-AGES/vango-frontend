import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TRIP_NEXT_STOP_QUERY_KEY } from '@/hooks/use-trip-next-stop';
import { TRIP_QUERY_KEY } from '@/hooks/use-trip';
import { markPassangerAbsent } from '@/services/trip.service';
import type { TripPassangerResponse } from '@/types/trip.types';

type MarkPassangerAbsentVariables = {
  tripId: string;
  tripPassangerId: string;
};

export function useMarkPassangerAbsent() {
  const queryClient = useQueryClient();

  return useMutation<TripPassangerResponse, unknown, MarkPassangerAbsentVariables>({
    mutationFn: ({ tripId, tripPassangerId }: MarkPassangerAbsentVariables) =>
      markPassangerAbsent(tripId, tripPassangerId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEY(variables.tripId) });
      queryClient.invalidateQueries({ queryKey: TRIP_NEXT_STOP_QUERY_KEY(variables.tripId) });
    },
  });
}
