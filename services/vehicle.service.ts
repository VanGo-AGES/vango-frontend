import { apiPost } from './api';
import type { CreateVehicleRequest, CreateVehicleResponse } from '@/types/vehicle.types';

export async function createVehicle(
  data: CreateVehicleRequest,
  userId: string,
  headers?: Record<string, string>,
): Promise<CreateVehicleResponse> {
  const customHeaders = {
    'X-User-Id': userId,
    'X-User-Role': 'driver',
    ...headers,
  };

  return apiPost<CreateVehicleRequest, CreateVehicleResponse>('/vehicles/', data, customHeaders);
}
