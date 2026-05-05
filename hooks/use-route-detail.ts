import { useQuery } from '@tanstack/react-query';

import { getRouteById } from '@/services/route.service';
import { useSessionStore } from '@/store/session.store';

export const ROUTE_DETAIL_QUERY_KEY = (routeId: string) => ['route', routeId];

export function useRouteDetail(routeId: string | undefined) {
  const sessionUser = useSessionStore((state) => state.user);

  return useQuery({
    queryKey: ROUTE_DETAIL_QUERY_KEY(routeId ?? ''),
    queryFn: () => getRouteById(routeId as string),
    enabled: !!sessionUser?.id && !!routeId,
  });
}
