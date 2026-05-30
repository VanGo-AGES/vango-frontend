import { useQuery } from '@tanstack/react-query';

import { getTrip } from '@/services/trip.service';
import { useSessionStore } from '@/store/session.store';

export const TRIP_QUERY_KEY = (tripId: string) => ['trip', tripId];

export function useTrip(tripId: string | undefined) {
  const sessionUser = useSessionStore((state) => state.user);

  return useQuery({
    queryKey: TRIP_QUERY_KEY(tripId ?? ''),
    queryFn: () => getTrip(tripId as string),
    enabled: !!sessionUser?.id && !!tripId,
  });
}
