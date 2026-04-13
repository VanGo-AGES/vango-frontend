export interface CreateVehicleRequest {
  plate: string;
  capacity: number;
  notes?: string | null;
}

export interface CreateVehicleResponse {
  id: string;
  driver_id: string;
  plate: string | null;
  capacity: number;
  notes: string | null;
  status: boolean;
  created_at: string;
}

export interface Vehicle extends CreateVehicleResponse {}
