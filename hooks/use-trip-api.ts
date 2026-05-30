import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as tripService from '@/services/trip.service';
import type { FinishTripRequest } from '@/types/trip.types';

export const TRIP_QUERY_KEY = (tripId: string) => ['trip', tripId];
export const TRIP_NEXT_STOP_QUERY_KEY = (tripId: string) => ['trip', tripId, 'next-stop'];

export function useTrip(tripId: string) {
  return useQuery({
    queryKey: TRIP_QUERY_KEY(tripId),
    queryFn: () => tripService.getTrip(tripId),
    enabled: !!tripId,
  });
}

export function useTripNextStop(tripId: string) {
  return useQuery({
    queryKey: TRIP_NEXT_STOP_QUERY_KEY(tripId),
    queryFn: () => tripService.getTripNextStop(tripId),
    enabled: !!tripId,
  });
}

export function useBoardPassanger() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, tpId }: { tripId: string; tpId: string }) =>
      tripService.boardPassanger(tripId, tpId),
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEY(tripId) });
      queryClient.invalidateQueries({ queryKey: TRIP_NEXT_STOP_QUERY_KEY(tripId) });
    },
  });
}

export function useMarkPassangerAbsent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, tpId }: { tripId: string; tpId: string }) =>
      tripService.markPassangerAbsent(tripId, tpId),
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEY(tripId) });
      queryClient.invalidateQueries({ queryKey: TRIP_NEXT_STOP_QUERY_KEY(tripId) });
    },
  });
}

export function useAlightPassanger() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, tpId }: { tripId: string; tpId: string }) =>
      tripService.alightPassanger(tripId, tpId),
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEY(tripId) });
      queryClient.invalidateQueries({ queryKey: TRIP_NEXT_STOP_QUERY_KEY(tripId) });
    },
  });
}

export function useSkipStop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, stopId }: { tripId: string; stopId: string }) =>
      tripService.skipStop(tripId, stopId),
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEY(tripId) });
      queryClient.invalidateQueries({ queryKey: TRIP_NEXT_STOP_QUERY_KEY(tripId) });
    },
  });
}

export function useFinishTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, data }: { tripId: string; data?: FinishTripRequest }) =>
      tripService.finishTrip(tripId, data),
    onSuccess: (_, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: TRIP_QUERY_KEY(tripId) });
      queryClient.invalidateQueries({ queryKey: ['driver-routes'] });
    },
  });
}
