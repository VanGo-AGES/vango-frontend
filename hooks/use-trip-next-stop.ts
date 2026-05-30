import { useQuery } from '@tanstack/react-query';

import { getTripNextStop } from '@/services/trip.service';
import { useSessionStore } from '@/store/session.store';

export const TRIP_NEXT_STOP_QUERY_KEY = (tripId: string) => ['trip', tripId, 'next-stop'];

export function useTripNextStop(tripId: string | undefined) {
  const sessionUser = useSessionStore((state) => state.user);

  return useQuery({
    queryKey: TRIP_NEXT_STOP_QUERY_KEY(tripId ?? ''),
    queryFn: () => getTripNextStop(tripId as string),
    enabled: !!sessionUser?.id && !!tripId,
  });
}
