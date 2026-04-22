import { apiPost } from './api';
import { useSessionStore } from '@/store/session.store';
import type { CreateRouteRequest, CreateRouteResponse } from '@/types/route.types';

function getDriverHeaders(): Record<string, string> {
  const user = useSessionStore.getState().user;
  return { 'X-User-Id': user?.id ?? '', 'X-User-Role': 'driver' };
}

export async function createRoute(data: CreateRouteRequest): Promise<CreateRouteResponse> {
  return apiPost<CreateRouteRequest, CreateRouteResponse>('/routes/', data, getDriverHeaders());
}
