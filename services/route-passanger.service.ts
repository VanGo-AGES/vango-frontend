import { apiGet } from './api';
import { useSessionStore } from '@/store/session.store';
import type { RoutePassangerResponse, RoutePassangerStatus } from '@/types/route.types';

function getDriverHeaders(): Record<string, string> {
  const user = useSessionStore.getState().user;
  return { 'X-User-Id': user?.id ?? '', 'X-User-Role': 'driver' };
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
