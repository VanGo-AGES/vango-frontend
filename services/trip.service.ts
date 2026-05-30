import { apiGet, apiPost } from './api';
import { useSessionStore } from '@/store/session.store';
import type { TripResponse, TripNextStopResponse, FinishTripRequest } from '@/types/trip.types';

// Garante que o backend saiba que é o motorista chamando
function getDriverHeaders(): Record<string, string> {
  const user = useSessionStore.getState().user;
  return {
    'X-User-Id': user?.id ?? '',
    'X-User-Role': user?.role ?? 'driver',
  };
}

export async function getTrip(tripId: string): Promise<TripResponse> {
  return apiGet<TripResponse>(`/trips/${tripId}`, getDriverHeaders());
}

export async function getTripNextStop(tripId: string): Promise<TripNextStopResponse | null> {
  return apiGet<TripNextStopResponse>(`/trips/${tripId}/next-stop`, getDriverHeaders());
}

export async function boardPassanger(tripId: string, tpId: string): Promise<void> {
  return apiPost<{}, void>(`/trips/${tripId}/passangers/${tpId}/board`, {}, getDriverHeaders());
}

export async function markPassangerAbsent(tripId: string, tpId: string): Promise<void> {
  return apiPost<{}, void>(`/trips/${tripId}/passangers/${tpId}/absent`, {}, getDriverHeaders());
}

export async function alightPassanger(tripId: string, tpId: string): Promise<void> {
  return apiPost<{}, void>(`/trips/${tripId}/passangers/${tpId}/alight`, {}, getDriverHeaders());
}

export async function skipStop(tripId: string, stopId: string): Promise<void> {
  return apiPost<{}, void>(`/trips/${tripId}/stops/${stopId}/skip`, {}, getDriverHeaders());
}

export async function finishTrip(tripId: string, data?: FinishTripRequest): Promise<void> {
  return apiPost<FinishTripRequest, void>(
    `/trips/${tripId}/finish`,
    data ?? {},
    getDriverHeaders(),
  );
}
