import { apiDelete, apiGet, apiPost, apiPut, getDriverHeaders } from './api';
import type {
  CreateRouteRequest,
  CreateRouteResponse,
  RouteAbsenceResponse,
  RoutePassangerResponse,
  RoutePassangerStatus,
  RouteResponse,
  RouteUpdate,
} from '@/types/route.types';

export async function createRoute(data: CreateRouteRequest): Promise<CreateRouteResponse> {
  return apiPost<CreateRouteRequest, CreateRouteResponse>('/routes/', data, getDriverHeaders());
}

export async function listDriverRoutes(): Promise<RouteResponse[]> {
  return apiGet<RouteResponse[]>('/routes/', getDriverHeaders());
}

export async function getRouteById(routeId: string): Promise<RouteResponse> {
  return apiGet<RouteResponse>(`/routes/${routeId}`, getDriverHeaders());
}

export async function updateRoute(routeId: string, data: RouteUpdate): Promise<RouteResponse> {
  return apiPut<RouteUpdate, RouteResponse>(`/routes/${routeId}`, data, getDriverHeaders());
}

export async function deleteRoute(routeId: string): Promise<void> {
  return apiDelete<void>(`/routes/${routeId}`, getDriverHeaders());
}

export async function removePassanger(routeId: string, rpId: string): Promise<void> {
  return apiDelete<void>(`/routes/${routeId}/passangers/${rpId}`, getDriverHeaders());
}

export async function listRouteAbsences(
  routeId: string,
  date?: string,
): Promise<RouteAbsenceResponse[]> {
  const query = date ? `?date=${encodeURIComponent(date)}` : '';
  return apiGet<RouteAbsenceResponse[]>(`/routes/${routeId}/absences${query}`, getDriverHeaders());
}

export function splitStopsByAbsence<T extends { route_passanger_id: string }>(
  stops: T[],
  absences: RouteAbsenceResponse[],
): { present: T[]; absent: T[] } {
  const absentRpIds = new Set(absences.map((absence) => absence.route_passanger_id));

  const present: T[] = [];
  const absent: T[] = [];

  for (const stop of stops) {
    if (absentRpIds.has(stop.route_passanger_id)) {
      absent.push(stop);
    } else {
      present.push(stop);
    }
  }

  return { present, absent };
}

export function isRouteToday(recurrence: string): boolean {
  const todayIndex = new Date().getDay();

  return recurrence
    .split(',')
    .map(getWeekdayIndex)
    .some((index) => index !== null && index === todayIndex);
}

/**
 * Retorna a data (YYYY-MM-DD) da próxima execução da rota.
 *
 * - Se hoje está na recorrência, retorna hoje (offset 0).
 * - Caso contrário, o próximo dia futuro que está na recorrência (1..6 à frente).
 * - Recorrência inválida ou vazia → null.
 *
 * Usa data local (mesmo critério de isRouteToday). O formato YYYY-MM-DD é o
 * mesmo aceito por GET /routes/{id}/absences?date=YYYY-MM-DD.
 */
export function getNextRouteOccurrenceDate(
  recurrence: string,
  now: Date = new Date(),
): string | null {
  const recurrenceDays = recurrence
    .split(',')
    .map(getWeekdayIndex)
    .filter((day): day is number => day !== null);

  if (!recurrenceDays.length) {
    return null;
  }

  const todayIndex = now.getDay();
  let bestOffset = 7;
  for (const target of recurrenceDays) {
    const offset = (target - todayIndex + 7) % 7;
    if (offset < bestOffset) {
      bestOffset = offset;
    }
  }

  const next = new Date(now);
  next.setHours(0, 0, 0, 0);
  next.setDate(next.getDate() + bestOffset);

  const yyyy = next.getFullYear();
  const mm = String(next.getMonth() + 1).padStart(2, '0');
  const dd = String(next.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function normalizeRecurrenceDay(day: string): string {
  return day
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function parseExpectedTime(
  value: string,
): { hours: number; minutes: number; seconds: number } | null {
  const match = value.trim().match(/^(\d{2}):(\d{2})(?::(\d{2}))?/);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] ?? '0');

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    Number.isNaN(seconds) ||
    hours > 23 ||
    minutes > 59 ||
    seconds > 59
  ) {
    return null;
  }

  return { hours, minutes, seconds };
}

function getWeekdayIndex(day: string): number | null {
  const normalizedDay = normalizeRecurrenceDay(day);

  switch (normalizedDay) {
    case 'dom':
    case 'domingo':
      return 0;
    case 'seg':
    case 'segunda':
    case 'segunda-feira':
      return 1;
    case 'ter':
    case 'terca':
    case 'terca-feira':
      return 2;
    case 'qua':
    case 'quarta':
    case 'quarta-feira':
      return 3;
    case 'qui':
    case 'quinta':
    case 'quinta-feira':
      return 4;
    case 'sex':
    case 'sexta':
    case 'sexta-feira':
      return 5;
    case 'sab':
    case 'sabado':
      return 6;
    default:
      return null;
  }
}

function getNextRouteOccurrence(route: RouteResponse, now: Date): Date | null {
  const expectedTime = parseExpectedTime(route.expected_time);

  if (!expectedTime) {
    return null;
  }

  const recurrenceDays = route.recurrence
    .split(',')
    .map(getWeekdayIndex)
    .filter((day): day is number => day !== null);

  if (!recurrenceDays.length) {
    return null;
  }

  let closestDate: Date | null = null;

  for (const weekday of recurrenceDays) {
    const candidateDate = new Date(now);
    candidateDate.setHours(expectedTime.hours, expectedTime.minutes, expectedTime.seconds, 0);

    const currentWeekday = candidateDate.getDay();
    const daysUntilOccurrence = (weekday - currentWeekday + 7) % 7;
    candidateDate.setDate(candidateDate.getDate() + daysUntilOccurrence);

    if (candidateDate <= now) {
      candidateDate.setDate(candidateDate.getDate() + 7);
    }

    if (!closestDate || candidateDate < closestDate) {
      closestDate = candidateDate;
    }
  }

  return closestDate;
}

export function getNextRoute(routes: RouteResponse[]): RouteResponse | null {
  const now = new Date();
  let nextRoute: RouteResponse | null = null;
  let nextRouteDate: Date | null = null;

  for (const route of routes) {
    const occurrenceDate = getNextRouteOccurrence(route, now);

    if (!occurrenceDate) {
      continue;
    }

    if (!nextRouteDate || occurrenceDate < nextRouteDate) {
      nextRoute = route;
      nextRouteDate = occurrenceDate;
    }
  }

  return nextRoute;
}

export async function listRoutePassangers(
  routeId: string,
  status?: RoutePassangerStatus,
): Promise<RoutePassangerResponse[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return apiGet<RoutePassangerResponse[]>(
    `/routes/${routeId}/passangers${query}`,
    getDriverHeaders(),
  );
}
