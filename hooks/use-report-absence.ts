import { useMutation, useQueryClient } from '@tanstack/react-query';

import { reportAbsence } from '@/services/absence.service';

function formatToday(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function useReportAbsence(routeId: string, dependentId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reason?: string) =>
      reportAbsence({
        route_id: routeId,
        absence_date: formatToday(),
        dependent_id: dependentId,
        reason,
      }),
    onSuccess: () => {
      // Invalida a query de ausências para que o stop seja filtrado
      // e o status do passageiro seja atualizado imediatamente.
      queryClient.invalidateQueries({ queryKey: ['passanger-route-absences', routeId] });
    },
  });
}
