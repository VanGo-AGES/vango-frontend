import { apiGet } from './api';
import { useSessionStore } from '@/store/session.store';
import type { CurrentTripResponse } from '@/types/trip.types';

function getPassengerHeaders(): Record<string, string> {
  const user = useSessionStore.getState().user;

  return {
    'X-User-Id': user?.id ?? '',
    'X-User-Role': 'guardian',
  };
}

export async function getCurrentTrip(
  routeId: string,
  dependentId?: string,
): Promise<CurrentTripResponse> {
  const query = dependentId ? `?dependent_id=${encodeURIComponent(dependentId)}` : '';

  return apiGet<CurrentTripResponse>(
    `/routes/${routeId}/trips/current${query}`,
    getPassengerHeaders(),
  );
}
