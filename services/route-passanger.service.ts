import { apiDelete, apiGet } from './api';
import { useSessionStore } from '@/store/session.store';
import type { PassangerRouteDetailResponse } from '@/types/route.types';

export function getPassangerHeaders(): Record<string, string> {
  const user = useSessionStore.getState().user;

  return {
    'X-User-Id': user?.id ?? '',
    'X-User-Role': 'passenger',
  };
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
