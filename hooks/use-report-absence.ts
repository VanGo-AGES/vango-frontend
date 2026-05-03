import { useMutation } from '@tanstack/react-query';

import { reportAbsence } from '@/services/absence.service';

function formatToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useReportAbsence(routeId: string, dependentId?: string) {
  return useMutation({
    mutationFn: (reason?: string) =>
      reportAbsence({
        route_id: routeId,
        absence_date: formatToday(),
        dependent_id: dependentId,
        reason,
      }),
  });
}
