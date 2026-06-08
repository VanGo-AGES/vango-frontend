import type { PassengerMembershipStatus, PassengerRouteStatus } from '@/types/route.types';

const WEEKDAY_INDEX: Record<string, number> = {
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

function normalizeWeekday(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function getWeekdayIndex(day: string): number | null {
  const normalizedDay = normalizeWeekday(day);
  return WEEKDAY_INDEX[normalizedDay] ?? null;
}

export function isRouteTodayFromList(recurrence: string[]): boolean {
  const todayIndex = new Date().getDay();
  return recurrence.some((day) => getWeekdayIndex(day) === todayIndex);
}

export function getPassangerCTA(
  routeStatus: PassengerRouteStatus | string,
  membershipStatus: PassengerMembershipStatus | string,
  currentTripId: string | null,
  recurrence: string[],
): 'avisar-ausencia' | 'acompanhar-viagem' | 'none' {
  if (membershipStatus !== 'accepted') {
    return 'none';
  }

  if (routeStatus === 'em_andamento' && currentTripId !== null) {
    return 'acompanhar-viagem';
  }

  if (routeStatus !== 'em_andamento' && isRouteTodayFromList(recurrence)) {
    return 'avisar-ausencia';
  }

  return 'none';
}
