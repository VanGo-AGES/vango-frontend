import { useQuery } from '@tanstack/react-query';

import { getPassangerRouteDetail } from '@/services/route-passanger.service';
import { useSessionStore } from '@/store/session.store';

type UsePassangerRouteDetailParams = {
  routeId?: string;
  dependentId?: string;
};

export function usePassangerRouteDetail({ routeId, dependentId }: UsePassangerRouteDetailParams) {
  const sessionUser = useSessionStore((state) => state.user);

  const query = useQuery({
    queryKey: ['passanger-route', routeId],
    queryFn: () => getPassangerRouteDetail(routeId ?? '', dependentId),
    enabled: !!routeId && !!sessionUser?.id,
  });

  return {
    route: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    error: query.error,
  };
}
