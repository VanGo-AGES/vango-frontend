import { useQuery } from '@tanstack/react-query';

import { listRoutePassangers } from '@/services/route.service';
import { useSessionStore } from '@/store/session.store';

export const ROUTE_PASSANGERS_QUERY_KEY = (routeId: string) => ['route-passangers', routeId];

export function useRoutePassangers(routeId: string | undefined) {
  const sessionUser = useSessionStore((state) => state.user);

  return useQuery({
    queryKey: ROUTE_PASSANGERS_QUERY_KEY(routeId ?? ''),
    queryFn: () => listRoutePassangers(routeId as string),
    enabled: !!sessionUser?.id && !!routeId,
  });
}
