export interface CreateVehicleRequest {
  plate: string;
  capacity: number;
  notes?: string | null;
}

export interface UpdateVehicleRequest {
  plate?: string;
  capacity?: number;
  notes?: string | null;
}

export interface VehicleResponse {
  id: string;
  driver_id: string;
  plate: string | null;
  capacity: number;
  notes: string | null;
  status: boolean;
  created_at: string;
}

// Aliases para consistência com o padrão do projeto
export type CreateVehicleResponse = VehicleResponse;
export type UpdateVehicleResponse = VehicleResponse;
