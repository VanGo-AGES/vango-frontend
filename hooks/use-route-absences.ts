import { useQuery } from '@tanstack/react-query';

import { getNextRouteOccurrenceDate, listRouteAbsences } from '@/services/route.service';
import { useSessionStore } from '@/store/session.store';

export const ROUTE_ABSENCES_QUERY_KEY = (routeId: string, date?: string) =>
  date ? ['route-absences', routeId, date] : ['route-absences', routeId];

type UseRouteAbsencesParams = {
  routeId: string | undefined;
  recurrence: string | undefined;
};

/**
 * Busca as ausências da rota para a data da próxima execução. Inclui hoje se
 * hoje estiver na recorrência; senão, o próximo dia futuro da recorrência.
 *
 * A query é desabilitada quando a recorrência é inválida (sem dia válido) ou
 * quando o usuário ainda não está logado.
 */
export function useRouteAbsences({ routeId, recurrence }: UseRouteAbsencesParams) {
  const sessionUser = useSessionStore((state) => state.user);
  const nextDate = recurrence ? getNextRouteOccurrenceDate(recurrence) : null;

  return useQuery({
    queryKey: ROUTE_ABSENCES_QUERY_KEY(routeId ?? '', nextDate ?? undefined),
    queryFn: () => listRouteAbsences(routeId as string, nextDate as string),
    enabled: !!sessionUser?.id && !!routeId && !!nextDate,
  });
}
