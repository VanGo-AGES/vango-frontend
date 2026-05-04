import { apiPost } from './api';
import { getPassangerHeaders } from './route-passanger.service';
import type { AbsenceResponse } from '@/types/absence.types';

export async function reportAbsence(data: {
  route_id: string;
  absence_date: string;
  dependent_id?: string;
  reason?: string;
}): Promise<AbsenceResponse> {
  return apiPost<typeof data, AbsenceResponse>('/absences', data, getPassangerHeaders());
}
