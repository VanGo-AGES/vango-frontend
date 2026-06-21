import { useQuery } from '@tanstack/react-query';

import { listPassangerRoutes } from '@/services/route-passanger.service';
import { useSessionStore } from '@/store/session.store';

export const PASSANGER_ROUTES_QUERY_KEY = ['passanger-routes'];

export function usePassangerRoutes() {
  const sessionUser = useSessionStore((state) => state.user);
  const accessToken = useSessionStore((state) => state.accessToken);

  return useQuery({
    queryKey: PASSANGER_ROUTES_QUERY_KEY,
    queryFn: listPassangerRoutes,
    enabled: !!sessionUser?.id && !!accessToken,
  });
}
