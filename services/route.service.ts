import { apiGet, apiPost } from './api';
import { useSessionStore } from '@/store/session.store';
import type { CreateRouteRequest, CreateRouteResponse, RouteResponse } from '@/types/route.types';

function getDriverHeaders(): Record<string, string> {
  const user = useSessionStore.getState().user;
  return { 'X-User-Id': user?.id ?? '', 'X-User-Role': 'driver' };
}

export async function createRoute(data: CreateRouteRequest): Promise<CreateRouteResponse> {
  return apiPost<CreateRouteRequest, CreateRouteResponse>('/routes/', data, getDriverHeaders());
}

export async function listDriverRoutes(): Promise<RouteResponse[]> {
  return apiGet<RouteResponse[]>('/routes/', getDriverHeaders());
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
