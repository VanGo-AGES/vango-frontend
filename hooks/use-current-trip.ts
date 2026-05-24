import { useQuery } from '@tanstack/react-query';

import { getCurrentTrip } from '@/services/trip.service';
import { useSessionStore } from '@/store/session.store';

export const CURRENT_TRIP_QUERY_KEY = (routeId?: string) => ['current-trip', routeId];

export function useCurrentTrip(routeId?: string, dependentId?: string) {
  const sessionUser = useSessionStore((state) => state.user);

  return useQuery({
    queryKey: CURRENT_TRIP_QUERY_KEY(routeId),
    queryFn: () => getCurrentTrip(routeId ?? '', dependentId),
    enabled: !!sessionUser?.id && !!routeId,
    retry: false,
  });
}
