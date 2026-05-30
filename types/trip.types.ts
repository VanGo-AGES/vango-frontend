// ==========================================
// STATUS E ENUMS
// ==========================================
export type TripPassangerStatusBackend =
  | 'pending'
  | 'present'
  | 'absent'
  | 'pendente'
  | 'presente'
  | 'ausente';
export type TripStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// ==========================================
// DTOs DA API (Backend)
// ==========================================
export interface TripPassangerResponse {
  id: string;
  name: string;
  phone_number: string;
  avatar_url?: string;
  status: TripPassangerStatusBackend;
  alighted_at?: string | null;
  address: {
    latitude: number;
    longitude: number;
    text: string;
  };
}

export interface TripResponse {
  id: string;
  route_id: string;
  status: TripStatus;
  total_km?: number | null;
  trip_passangers: TripPassangerResponse[];
}

export interface TripNextStopResponse {
  stop_id: string;
  order_index: number;
  address_label: string;
  latitude: number;
  longitude: number;
  passanger_name: string;
  passanger_phone: string;
  trip_passanger_id: string;
  trip_passanger_status: TripPassangerStatusBackend;
}

export interface CurrentTripResponse {
  trip_id: string;
  status: string;
  started_at: string;
  driver_name: string;
  driver_photo_url: string | null;
  vehicle_plate: string | null;
}

// ==========================================
// PAYLOADS DE REQUEST (Mutações)
// ==========================================
export interface StartTripRequest {
  vehicle_id: string;
  trip_date?: string;
}

export interface FinishTripRequest {
  total_km?: number | null;
}

// ==========================================
// TRACKING & SOCKETS
// ==========================================
export interface TrackerLocationPayload {
  trip_id: string;
  lat: number;
  lng: number;
  heading?: number | null;
  speed?: number | null;
  timestamp?: number;
  updated_at?: string;
}

export interface DriverEtaPayload {
  stop_id?: string;
  trip_id: string;
  eta_minutes: number;
  distance_km: number;
}

export type LocationUpdateBroadcast = TrackerLocationPayload & Partial<DriverEtaPayload>;
