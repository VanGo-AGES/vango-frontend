import { useMemo } from 'react';

const WEEKDAY_INDEX: Record<string, number> = {
  Seg: 1,
  Ter: 2,
  Qua: 3,
  Qui: 4,
  Sex: 5,
  Sab: 6,
  Dom: 0,
};

export function useIsRouteDay(recurrence: string[]): boolean {
  return useMemo(() => {
    const todayIndex = new Date().getDay();
    return recurrence.some((day) => WEEKDAY_INDEX[day] === todayIndex);
  }, [recurrence]);
}
