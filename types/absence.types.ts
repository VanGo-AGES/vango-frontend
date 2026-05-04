export interface AbsenceResponse {
  id: string;
  route_id: string;
  absence_date: string;
  dependent_id: string | null;
  reason: string | null;
  created_at: string;
}
