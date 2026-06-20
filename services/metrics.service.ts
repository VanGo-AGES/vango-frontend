import type { MetricsReportResponse, ReportPeriod } from '@/types/metrics.types';
import { apiGet } from '@/services/api';

export async function getTripReport(
  period: ReportPeriod,
  startDate: string,
  endDate?: string,
): Promise<MetricsReportResponse> {
  const query = `period=${encodeURIComponent(period)}&start_date=${encodeURIComponent(startDate)}${endDate ? `&end_date=${encodeURIComponent(endDate)}` : ''}`;

  return apiGet<MetricsReportResponse>(`/metrics/reports?${query}`);
}
