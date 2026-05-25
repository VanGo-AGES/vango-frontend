import { useEffect, useState } from 'react';

import { connectAsFollower } from '@/services/passenger-trip-tracker.service';
import { useSessionStore } from '@/store/session.store';
import type {
  DriverEtaPayload,
  LocationUpdateBroadcast,
  TrackerLocationPayload,
} from '@/types/trip.types';

type UsePassengerTripTrackerParams = {
  tripId?: string | null;
  stopLat?: number | null;
  stopLng?: number | null;
};

export function usePassengerTripTracker({
  tripId,
  stopLat,
  stopLng,
}: UsePassengerTripTrackerParams) {
  const sessionUser = useSessionStore((state) => state.user);

  const [driverLocation, setDriverLocation] = useState<TrackerLocationPayload | null>(null);
  const [eta, setEta] = useState<DriverEtaPayload | null>(null);
  const [trackerOnline, setTrackerOnline] = useState(false);
  const [tripFinished, setTripFinished] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!sessionUser?.id || !tripId || stopLat == null || stopLng == null) {
      return;
    }

    setDriverLocation(null);
    setEta(null);
    setTrackerOnline(false);
    setTripFinished(false);
    setError(null);

    const tracker = connectAsFollower({
      userId: sessionUser.id,
      tripId,
      stopLat,
      stopLng,
    });

    tracker.onSessionJoined((payload) => {
      setTrackerOnline(true);

      if (payload.last_location) {
        setDriverLocation(payload.last_location);
      }

      if (payload.eta) {
        setEta(payload.eta);
      }
    });

    tracker.onLocationUpdate((payload: LocationUpdateBroadcast) => {
      setTrackerOnline(true);
      setDriverLocation(payload);

      if (payload.eta_minutes != null && payload.distance_km != null) {
        setEta({
          trip_id: payload.trip_id,
          eta_minutes: payload.eta_minutes,
          distance_km: payload.distance_km,
        });
      }
    });

    tracker.onDriverEta((payload) => {
      setEta(payload);
    });

    tracker.onTripFinished(() => {
      setTripFinished(true);
    });

    tracker.onTrackerDisconnected(() => {
      setTrackerOnline(false);
    });

    tracker.onError((socketError) => {
      setError(socketError);
    });

    return () => {
      tracker.disconnect();
    };
  }, [sessionUser?.id, tripId, stopLat, stopLng]);

  return {
    driverLocation,
    eta,
    trackerOnline,
    tripFinished,
    error,
  };
}
