import { useMemo } from 'react';

const WEEKDAY_INDEX: Record<string, number> = {
  dom: 0,
  seg: 1,
  ter: 2,
  qua: 3,
  qui: 4,
  sex: 5,
  sab: 6,
};

function normalizeDay(value: string): string {
  return value.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function useIsRouteDay(recurrence: string[]): boolean {
  return useMemo(() => {
    const todayIndex = new Date().getDay();
    return recurrence.some((day) => WEEKDAY_INDEX[normalizeDay(day)] === todayIndex);
  }, [recurrence]);
}
