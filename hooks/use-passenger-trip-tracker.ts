import { useEffect, useState } from 'react';

import { connectAsFollower } from '@/services/passenger-trip-tracker.service';
import { useSessionStore } from '@/store/session.store';
import type {
  DriverEtaPayload,
  LocationUpdateBroadcast,
  TrackerLocationPayload,
} from '@/types/trip.types';

const lastKnownLocationCache = new Map<string, TrackerLocationPayload>();

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

  const [driverLocation, setDriverLocation] = useState<TrackerLocationPayload | null>(() =>
    tripId ? (lastKnownLocationCache.get(tripId) ?? null) : null,
  );
  const [eta, setEta] = useState<DriverEtaPayload | null>(null);
  const [trackerOnline, setTrackerOnline] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [tripFinished, setTripFinished] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!sessionUser?.id || !tripId) {
      return;
    }

    setDriverLocation(lastKnownLocationCache.get(tripId) ?? null);
    setEta(null);
    setTrackerOnline(false);
    setConnecting(true);
    setTripFinished(false);
    setError(null);

    const failOnce = (socketError: unknown) => setError((prev: unknown) => prev ?? socketError);

    const hasConnected = { current: false };

    const tracker = connectAsFollower({
      userId: sessionUser.id,
      tripId,
      stopLat: stopLat ?? null,
      stopLng: stopLng ?? null,
    });

    tracker.onConnect(() => {
      hasConnected.current = true;
    });

    tracker.onConnectError((connectError) => {
      if (!hasConnected.current) {
        failOnce(connectError);
      }
    });

    tracker.onSessionJoined((payload) => {
      setConnecting(false);
      setTrackerOnline(payload.tracker_online ?? false);

      if (payload.last_location) {
        lastKnownLocationCache.set(tripId, payload.last_location);
        setDriverLocation(payload.last_location);
      }

      if (payload.eta) {
        setEta(payload.eta);
      }
    });

    tracker.onLocationUpdate((payload: LocationUpdateBroadcast) => {
      setConnecting(false);
      setTrackerOnline(true);
      lastKnownLocationCache.set(tripId, payload);
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
      lastKnownLocationCache.delete(tripId);
      setTripFinished(true);
    });

    tracker.onTrackerDisconnected(() => {
      setTrackerOnline(false);
    });

    tracker.onError(failOnce);

    return () => {
      tracker.disconnect();
    };
  }, [sessionUser?.id, tripId, stopLat, stopLng]);

  return {
    driverLocation,
    eta,
    trackerOnline,
    connecting,
    tripFinished,
    error,
  };
}
