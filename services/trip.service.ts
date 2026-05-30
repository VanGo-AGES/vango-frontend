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

// --- Execução da viagem pelo motorista (US09) ---

/** Detalhes da viagem em andamento (rota dinâmica). */
export async function getTrip(tripId: string): Promise<TripResponse> {
  return apiGet<TripResponse>(`/trips/${tripId}`, getDriverHeaders());
}

/** Próxima parada pendente da viagem (null quando não há). */
export async function getTripNextStop(tripId: string): Promise<TripNextStopResponse | null> {
  return apiGet<TripNextStopResponse | null>(`/trips/${tripId}/next-stop`, getDriverHeaders());
}

/**
 * Viagem em andamento da rota, consultada como motorista.
 * Usado na recuperação do 409 TripAlreadyInProgressError ao iniciar rota.
 */
export async function getDriverCurrentTrip(routeId: string): Promise<CurrentTripResponse | null> {
  return apiGet<CurrentTripResponse | null>(`/routes/${routeId}/trips/current`, getDriverHeaders());
}

/** Inicia a execução da rota (cria a Trip). */
export async function startTrip(routeId: string, data: StartTripRequest): Promise<TripResponse> {
  return apiPost<StartTripRequest, TripResponse>(
    `/routes/${routeId}/trips`,
    data,
    getDriverHeaders(),
  );
}

/** Confirma o embarque de um passageiro. */
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

/** Marca um passageiro como ausente (não embarcou). */
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

/** Registra o desembarque manual de um passageiro. */
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

/** Pula uma parada (marca os passageiros dela como ausentes). */
export async function skipStop(tripId: string, stopId: string): Promise<TripPassangerResponse[]> {
  return apiPost<undefined, TripPassangerResponse[]>(
    `/trips/${tripId}/stops/${stopId}/skip`,
    undefined,
    getDriverHeaders(),
  );
}

/** Finaliza a viagem. */
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
