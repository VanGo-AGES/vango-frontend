import { apiGet, apiPost, getDriverHeaders } from './api';
import { useSessionStore } from '@/store/session.store';
import type {
  CurrentTripResponse,
  FinishTripRequest,
  StartTripRequest,
  TripNextStopResponse,
  TripPassangerResponse,
  TripResponse,
} from '@/types/trip.types';

function getPassengerHeaders(): Record<string, string> {
  const user = useSessionStore.getState().user;

  return {
    'X-User-Id': user?.id ?? '',
    'X-User-Role': user?.role ?? 'guardian',
  };
}

export async function getCurrentTrip(
  routeId: string,
  dependentId?: string,
): Promise<CurrentTripResponse> {
  const query = dependentId ? `?dependent_id=${encodeURIComponent(dependentId)}` : '';

  return apiGet<CurrentTripResponse>(
    `/routes/${routeId}/trips/current${query}`,
    getPassengerHeaders(),
  );
}

export async function getTrip(tripId: string): Promise<TripResponse> {
  return apiGet<TripResponse>(`/trips/${tripId}`, getDriverHeaders());
}

export async function getTripNextStop(tripId: string): Promise<TripNextStopResponse | null> {
  return apiGet<TripNextStopResponse | null>(`/trips/${tripId}/next-stop`, getDriverHeaders());
}

// Consultada pelo motorista na recuperação do 409 TripAlreadyInProgressError.
export async function getDriverCurrentTrip(routeId: string): Promise<CurrentTripResponse | null> {
  return apiGet<CurrentTripResponse | null>(`/routes/${routeId}/trips/current`, getDriverHeaders());
}

export async function startTrip(routeId: string, data: StartTripRequest): Promise<TripResponse> {
  return apiPost<StartTripRequest, TripResponse>(
    `/routes/${routeId}/trips`,
    data,
    getDriverHeaders(),
  );
}

export async function boardPassanger(
  tripId: string,
  tripPassangerId: string,
): Promise<TripPassangerResponse> {
  return apiPost<undefined, TripPassangerResponse>(
    `/trips/${tripId}/passangers/${tripPassangerId}/board`,
    undefined,
    getDriverHeaders(),
  );
}

export async function markPassangerAbsent(
  tripId: string,
  tripPassangerId: string,
): Promise<TripPassangerResponse> {
  return apiPost<undefined, TripPassangerResponse>(
    `/trips/${tripId}/passangers/${tripPassangerId}/absent`,
    undefined,
    getDriverHeaders(),
  );
}

export async function alightPassanger(
  tripId: string,
  tripPassangerId: string,
): Promise<TripPassangerResponse> {
  return apiPost<undefined, TripPassangerResponse>(
    `/trips/${tripId}/passangers/${tripPassangerId}/alight`,
    undefined,
    getDriverHeaders(),
  );
}

export async function skipStop(tripId: string, stopId: string): Promise<TripPassangerResponse[]> {
  return apiPost<undefined, TripPassangerResponse[]>(
    `/trips/${tripId}/stops/${stopId}/skip`,
    undefined,
    getDriverHeaders(),
  );
}

export async function finishTrip(
  tripId: string,
  data: FinishTripRequest = { total_km: null },
): Promise<TripResponse> {
  return apiPost<FinishTripRequest, TripResponse>(
    `/trips/${tripId}/finish`,
    data,
    getDriverHeaders(),
  );
}
