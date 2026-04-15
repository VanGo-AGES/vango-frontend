import { apiPost } from '@/services/api';
import type { CreateVehicleRequest, CreateVehicleResponse } from '@/types/vehicles.types';

export async function createVehicle(
  data: CreateVehicleRequest,
  userId: string,
): Promise<CreateVehicleResponse> {
  return apiPost<CreateVehicleRequest, CreateVehicleResponse>('/vehicles/', data, {
    'X-User-Id': userId,
    'X-User-Role': 'driver',
  });
}
