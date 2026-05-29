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
