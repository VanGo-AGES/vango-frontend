import type { components } from './api.generated';

export type TripStatus = 'iniciada' | 'finalizada' | 'cancelada';
export type TripPassangerStatus = 'pendente' | 'presente' | 'ausente';

export type TripPassangerResponse = Omit<
  components['schemas']['TripPassangerResponse'],
  'status' | 'photo_url'
> & {
  status: TripPassangerStatus;
  photo_url: string | null;
};

export type TripResponse = Omit<
  components['schemas']['TripResponse'],
  'status' | 'trip_passangers'
> & {
  status: TripStatus;
  trip_passangers: TripPassangerResponse[];
};

export type TripNextStopResponse = Omit<
  components['schemas']['TripNextStopResponse'],
  'trip_passanger_status'
> & {
  trip_passanger_status: TripPassangerStatus;
};

export type StartTripRequest = components['schemas']['StartTripRequest'];

export type FinishTripRequest = components['schemas']['FinishTripRequest'];

export type CurrentTripResponse = Omit<
  components['schemas']['CurrentTripResponse'],
  'driver_photo_url' | 'vehicle_plate'
> & {
  driver_photo_url: string | null;
  vehicle_plate: string | null;
};

// Estruturas de comunicação em tempo real (Sockets/Tracker)
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
