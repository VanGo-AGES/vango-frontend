import { apiGet, apiPost, apiPut } from '@/services/api';
import { useSessionStore } from '@/store/session.store';
import type {
  CreateVehicleRequest,
  CreateVehicleResponse,
  UpdateVehicleRequest,
  UpdateVehicleResponse,
  VehicleResponse,
} from '@/types/vehicle.types';

function getDriverHeaders(): Record<string, string> {
  const user = useSessionStore.getState().user;
  return {
    'X-User-Id': user?.id ?? '',
    'X-User-Role': 'driver',
  };
}

export async function listVehicles(): Promise<VehicleResponse[]> {
  return apiGet<VehicleResponse[]>('/vehicles/', getDriverHeaders());
}

export async function createVehicle(data: CreateVehicleRequest): Promise<CreateVehicleResponse> {
  return apiPost<CreateVehicleRequest, CreateVehicleResponse>(
    '/vehicles/',
    data,
    getDriverHeaders(),
  );
}

export async function updateVehicle(
  vehicleId: string,
  data: UpdateVehicleRequest,
): Promise<UpdateVehicleResponse> {
  return apiPut<UpdateVehicleRequest, UpdateVehicleResponse>(
    `/vehicles/${vehicleId}`,
    data,
    getDriverHeaders(),
  );
}
