import { useQuery } from '@tanstack/react-query';

import { isRouteToday, listRouteAbsences } from '@/services/route.service';
import { useSessionStore } from '@/store/session.store';

export const ROUTE_ABSENCES_QUERY_KEY = (routeId: string) => ['route-absences', routeId];

type UseRouteAbsencesParams = {
  routeId: string | undefined;
  recurrence: string | undefined;
};

export function useRouteAbsences({ routeId, recurrence }: UseRouteAbsencesParams) {
  const sessionUser = useSessionStore((state) => state.user);
  const isToday = recurrence ? isRouteToday(recurrence) : false;

  return useQuery({
    queryKey: ROUTE_ABSENCES_QUERY_KEY(routeId ?? ''),
    queryFn: () => listRouteAbsences(routeId as string),
    enabled: !!sessionUser?.id && !!routeId && isToday,
  });
}
