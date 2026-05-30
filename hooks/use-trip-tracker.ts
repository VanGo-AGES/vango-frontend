import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { tripTrackerService } from '@/services/trip-tracker.service';
import { useSessionStore } from '@/store/session.store';
import type { DriverEtaPayload, TrackerLocationPayload } from '@/types/trip.types';

// Reemite a última posição neste intervalo mesmo parado. Garante que o backend
// receba location_update contínuo (calculando ETA) e cobre a corrida entre o
// primeiro fix de GPS e o connect do socket — sem isso, em GPS estático (ex.:
// simulador) o motorista emitiria zero ou uma única vez.
const EMIT_INTERVAL_MS = 4000;

export function useTripTracker(tripId: string) {
  const user = useSessionStore((state) => state.user);
  const [eta, setEta] = useState<DriverEtaPayload | null>(null);
  const [lastLocation, setLastLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const lastCoordsRef = useRef<TrackerLocationPayload | null>(null);

  useEffect(() => {
    if (!tripId || !user?.id) return;

    let locationSubscription: Location.LocationSubscription | null = null;
    let heartbeat: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    const pushCoords = (coords: Location.LocationObjectCoords) => {
      setLastLocation(coords);
      lastCoordsRef.current = {
        trip_id: tripId,
        lat: coords.latitude,
        lng: coords.longitude,
        heading: coords.heading,
        speed: coords.speed,
      };
      tripTrackerService.emitLocationUpdate(lastCoordsRef.current);
    };

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permissão de localização negada.');
        return;
      }
      if (cancelled) return;

      tripTrackerService.connectAsTracker(user.id, tripId);
      setIsConnected(true);
      tripTrackerService.onDriverEta((payload) => setEta(payload));

      // Posição inicial imediata (não espera o watcher disparar).
      try {
        const initial = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        if (!cancelled) pushCoords(initial.coords);
      } catch {
        // sem fix inicial — o watcher/heartbeat cobrem
      }

      locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 4000, distanceInterval: 5 },
        (location) => pushCoords(location.coords),
      );

      heartbeat = setInterval(() => {
        if (lastCoordsRef.current) {
          tripTrackerService.emitLocationUpdate(lastCoordsRef.current);
        }
      }, EMIT_INTERVAL_MS);
    };

    startTracking();

    return () => {
      cancelled = true;
      if (heartbeat) clearInterval(heartbeat);
      locationSubscription?.remove();
      tripTrackerService.disconnect();
      setIsConnected(false);
    };
  }, [tripId, user?.id]);

  return { eta, lastLocation, isConnected, error };
}
