// Espelham src/domains/trips/dtos.py do backend.
export type TripStatus = 'iniciada' | 'finalizada' | 'cancelada';

export type TripPassangerStatus = 'pendente' | 'presente' | 'ausente';

export interface TripPassangerResponse {
  id: string;
  route_passanger_id: string;
  passanger_name: string;
  status: TripPassangerStatus;
  pickup_address_label: string;
  boarded_at: string | null;
  alighted_at: string | null;
  user_phone: string;
  photo_url: string | null;
}

export interface TripResponse {
  id: string;
  route_id: string;
  route_name: string;
  vehicle_id: string;
  trip_date: string;
  status: TripStatus;
  total_km: number | null;
  started_at: string | null;
  finished_at: string | null;
  trip_passangers: TripPassangerResponse[];
}

export interface TripNextStopResponse {
  stop_id: string;
  order_index: number;
  address_label: string;
  passanger_name: string;
  passanger_phone: string;
  trip_passanger_id: string;
  trip_passanger_status: TripPassangerStatus;
  latitude: number | null;
  longitude: number | null;
}

export interface StartTripRequest {
  vehicle_id: string;
  trip_date?: string | null;
}

export interface FinishTripRequest {
  total_km: number | null;
}

export interface CurrentTripResponse {
  trip_id: string;
  status: string;
  started_at: string;
  driver_name: string;
  driver_photo_url: string | null;
  vehicle_plate: string | null;
}

export interface TrackerLocationPayload {
  trip_id: string;
  lat: number;
  lng: number;
  heading?: number | null;
  speed?: number | null;
  updated_at?: string;
}

export interface DriverEtaPayload {
  trip_id: string;
  eta_minutes: number;
  distance_km: number;
}

export type LocationUpdateBroadcast = TrackerLocationPayload & Partial<DriverEtaPayload>;
