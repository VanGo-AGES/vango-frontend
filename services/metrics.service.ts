import type { MetricsReportResponse, ReportPeriod } from '@/types/metrics.types';
import { apiGet } from '@/services/api';

export async function getTripReport(
  period: ReportPeriod,
  startDate: string,
  endDate?: string,
): Promise<MetricsReportResponse> {
  const params = new URLSearchParams({
    period,
    start_date: startDate,
  });

  if (endDate) {
    params.append('end_date', endDate);
  }

  return apiGet<MetricsReportResponse>(`/metrics/reports?${params.toString()}`);
}
