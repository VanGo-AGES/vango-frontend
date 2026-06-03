import { apiGet, apiPost, apiPut, getDriverHeaders } from '@/services/api';
import type {
  CreateVehicleRequest,
  CreateVehicleResponse,
  UpdateVehicleRequest,
  UpdateVehicleResponse,
  VehicleResponse,
} from '@/types/vehicle.types';

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
