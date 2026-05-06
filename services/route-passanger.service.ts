import { apiDelete, apiGet, apiPost } from './api';
import { useSessionStore } from '@/store/session.store';
import type {
  JoinRouteRequest,
  JoinRouteResponse,
  PassangerRouteDetailResponse,
  PassangerRouteListItem,
  RouteAbsenceResponse,
  RouteInviteSummaryResponse,
  RoutePassangerResponse,
} from '@/types/route.types';

export function getPassangerHeaders(): Record<string, string> {
  const user = useSessionStore.getState().user;

  return {
    'X-User-Id': user?.id ?? '',
    'X-User-Role': 'passenger',
  };
}

function getDriverHeaders(): Record<string, string> {
  const user = useSessionStore.getState().user;

  return {
    'X-User-Id': user?.id ?? '',
    'X-User-Role': 'driver',
  };
}

export async function listRoutePassangers(routeId: string): Promise<RoutePassangerResponse[]> {
  return apiGet<RoutePassangerResponse[]>(`/routes/${routeId}/passangers`, getDriverHeaders());
}

export async function acceptRequest(
  routeId: string,
  rpId: string,
): Promise<RoutePassangerResponse> {
  return apiPost<undefined, RoutePassangerResponse>(
    `/routes/${routeId}/passangers/${rpId}/accept`,
    undefined,
    getDriverHeaders(),
  );
}

export async function rejectRequest(
  routeId: string,
  rpId: string,
): Promise<RoutePassangerResponse> {
  return apiPost<undefined, RoutePassangerResponse>(
    `/routes/${routeId}/passangers/${rpId}/reject`,
    undefined,
    getDriverHeaders(),
  );
}

export async function removePassanger(routeId: string, rpId: string): Promise<void> {
  await apiDelete<void>(`/routes/${routeId}/passangers/${rpId}`, getDriverHeaders());
}

export async function getPassangerRouteDetail(
  routeId: string,
  dependentId?: string,
): Promise<PassangerRouteDetailResponse> {
  const query = dependentId ? `?dependent_id=${encodeURIComponent(dependentId)}` : '';
  return apiGet<PassangerRouteDetailResponse>(
    `/routes/${routeId}/me${query}`,
    getPassangerHeaders(),
  );
}

export async function leaveRoute(routeId: string, dependentId?: string): Promise<void> {
  const query = dependentId ? `?dependent_id=${encodeURIComponent(dependentId)}` : '';
  await apiDelete<void>(`/routes/${routeId}/passangers/me${query}`, getPassangerHeaders());
}

export async function listPassangerRoutes(): Promise<PassangerRouteListItem[]> {
  return apiGet<PassangerRouteListItem[]>('/routes/me', getPassangerHeaders());
}

export async function listPassangerRouteAbsences(
  routeId: string,
  date?: string,
): Promise<RouteAbsenceResponse[]> {
  const query = date ? `?date=${encodeURIComponent(date)}` : '';
  return apiGet<RouteAbsenceResponse[]>(
    `/routes/${routeId}/absences${query}`,
    getPassangerHeaders(),
  );
}

export function getNextRouteOccurrenceDateFromList(
  recurrence: string[],
  now: Date = new Date(),
): string | null {
  const days = recurrence.map(toWeekdayIndex).filter((d): d is number => d !== null);

  if (!days.length) return null;

  const todayIndex = now.getDay();
  let bestOffset = 7;
  for (const target of days) {
    const offset = (target - todayIndex + 7) % 7;
    if (offset < bestOffset) bestOffset = offset;
  }

  const next = new Date(now);
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() + bestOffset);

  const yyyy = next.getFullYear();
  const mm = String(next.getMonth() + 1).padStart(2, '0');
  const dd = String(next.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function parseExpectedTime(value: string): { hours: number; minutes: number } | null {
  const match = value.trim().match(/^(\d{2}):(\d{2})/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (isNaN(hours) || isNaN(minutes) || hours > 23 || minutes > 59) return null;
  return { hours, minutes };
}

function toWeekdayIndex(day: string): number | null {
  const normalized = day.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const map: Record<string, number> = {
    dom: 0,
    domingo: 0,
    seg: 1,
    segunda: 1,
    'segunda-feira': 1,
    ter: 2,
    terca: 2,
    'terca-feira': 2,
    qua: 3,
    quarta: 3,
    'quarta-feira': 3,
    qui: 4,
    quinta: 4,
    'quinta-feira': 4,
    sex: 5,
    sexta: 5,
    'sexta-feira': 5,
    sab: 6,
    sabado: 6,
  };
  return map[normalized] ?? null;
}

export function getNextPassangerRoute(
  routes: PassangerRouteListItem[],
): PassangerRouteListItem | null {
  const now = new Date();
  let next: PassangerRouteListItem | null = null;
  let nextDate: Date | null = null;

  for (const route of routes) {
    if (route.membership_status !== 'accepted') continue;

    const time = parseExpectedTime(route.expected_time);
    if (!time) continue;

    const days = route.recurrence.map(toWeekdayIndex).filter((d): d is number => d !== null);

    for (const weekday of days) {
      const candidate = new Date(now);
      candidate.setHours(time.hours, time.minutes, 0, 0);
      const daysUntil = (weekday - candidate.getDay() + 7) % 7;
      candidate.setDate(candidate.getDate() + daysUntil);
      if (candidate <= now) candidate.setDate(candidate.getDate() + 7);

      if (!nextDate || candidate < nextDate) {
        next = route;
        nextDate = candidate;
      }
    }
  }

  return next;
}

export async function joinRoute(
  routeId: string,
  data: JoinRouteRequest,
): Promise<JoinRouteResponse> {
  return apiPost<JoinRouteRequest, JoinRouteResponse>(
    `/routes/${routeId}/passangers`,
    data,
    getPassangerHeaders(),
  );
}

export async function getRouteByInviteCode(
  inviteCode: string,
): Promise<RouteInviteSummaryResponse> {
  return apiGet<RouteInviteSummaryResponse>(
    `/routes/invite/${encodeURIComponent(inviteCode)}`,
    getPassangerHeaders(),
  );
}
