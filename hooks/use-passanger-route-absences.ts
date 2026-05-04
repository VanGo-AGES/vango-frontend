import { useQuery } from '@tanstack/react-query';

import {
  getNextRouteOccurrenceDateFromList,
  listPassangerRouteAbsences,
} from '@/services/route-passanger.service';
import { useSessionStore } from '@/store/session.store';

type UsePassangerRouteAbsencesParams = {
  routeId: string | undefined;
  recurrence: string[] | undefined;
};

export function usePassangerRouteAbsences({
  routeId,
  recurrence,
}: UsePassangerRouteAbsencesParams) {
  const sessionUser = useSessionStore((state) => state.user);
  const nextDate = recurrence ? getNextRouteOccurrenceDateFromList(recurrence) : null;

  return useQuery({
    queryKey: ['passanger-route-absences', routeId, nextDate ?? undefined],
    queryFn: () => listPassangerRouteAbsences(routeId as string, nextDate ?? undefined),
    enabled: !!sessionUser?.id && !!routeId && !!nextDate,
  });
}
