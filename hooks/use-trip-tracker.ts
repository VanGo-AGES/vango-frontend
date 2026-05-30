import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { tripTrackerService } from '@/services/trip-tracker.service';
import { useSessionStore } from '@/store/session.store';
import type { DriverEtaPayload } from '@/types/trip.types';

export function useTripTracker(tripId: string) {
  const user = useSessionStore((state) => state.user);
  const [eta, setEta] = useState<DriverEtaPayload | null>(null);
  const [lastLocation, setLastLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!tripId || !user?.id) return;

    let locationSubscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permissão de localização negada.');
        return;
      }

      tripTrackerService.connectAsTracker(user.id, tripId);
      setIsConnected(true);

      tripTrackerService.onDriverEta((payload) => {
        setEta(payload);
      });

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          setLastLocation(location.coords);
          tripTrackerService.emitLocationUpdate({
            trip_id: tripId,
            lat: location.coords.latitude,
            lng: location.coords.longitude,
            heading: location.coords.heading,
            speed: location.coords.speed,
            timestamp: location.timestamp,
          });
        },
      );
    };

    startTracking();

    return () => {
      locationSubscription?.remove();
      tripTrackerService.disconnect();
      setIsConnected(false);
    };
  }, [tripId, user?.id]);

  return { eta, lastLocation, isConnected, error };
}
