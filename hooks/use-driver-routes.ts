import { useQuery } from '@tanstack/react-query';

import { listDriverRoutes } from '@/services/route.service';
import { useSessionStore } from '@/store/session.store';

export const DRIVER_ROUTES_QUERY_KEY = ['driver-routes'];

export function useDriverRoutes() {
  const sessionUser = useSessionStore((state) => state.user);
  const accessToken = useSessionStore((state) => state.accessToken);

  return useQuery({
    queryKey: DRIVER_ROUTES_QUERY_KEY,
    queryFn: listDriverRoutes,
    enabled: !!sessionUser?.id && !!accessToken,
  });
}
