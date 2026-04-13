import { apiPost } from './api';
import type { CreateRouteRequest, CreateRouteResponse } from '@/types/route.types';

export async function createRoute(
  data: CreateRouteRequest,
  userId: string,
): Promise<CreateRouteResponse> {
  return apiPost<CreateRouteRequest, CreateRouteResponse>('/routes/', data, {
    'X-User-Id': userId,
  });
}
