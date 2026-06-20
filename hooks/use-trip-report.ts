import { useQuery } from '@tanstack/react-query';
import { getTripReport } from '@/services/metrics.service';
import type { ReportPeriodType } from '@/components/metrics/report-period-tabs';

// Garante que a data enviada seja a local do celular (ex: 2026-06-20)
function formatDateLocal(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function useTripReport(period: ReportPeriodType, startDate?: Date, endDate?: Date) {
  const startStr = startDate ? formatDateLocal(startDate) : '';
  const endStr = endDate ? formatDateLocal(endDate) : undefined;

  return useQuery({
    queryKey: ['trip-report', period, startStr, endStr],
    queryFn: () => getTripReport(period, startStr, endStr),
    enabled: !!startStr,
  });
}
