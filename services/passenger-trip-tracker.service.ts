import { io, type Socket } from 'socket.io-client';

import type {
  DriverEtaPayload,
  LocationUpdateBroadcast,
  TrackerLocationPayload,
} from '@/types/trip.types';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

type SessionJoinedPayload = {
  trip_id: string;
  tracker_online?: boolean;
  last_location?: TrackerLocationPayload | null;
  eta?: DriverEtaPayload | null;
};

type ConnectAsFollowerParams = {
  userId: string;
  tripId: string;
  stopLat: number;
  stopLng: number;
};

export type PassengerTripTracker = {
  socket: Socket;
  onSessionJoined: (callback: (payload: SessionJoinedPayload) => void) => void;
  onLocationUpdate: (callback: (payload: LocationUpdateBroadcast) => void) => void;
  onDriverEta: (callback: (payload: DriverEtaPayload) => void) => void;
  onTripFinished: (callback: () => void) => void;
  onTrackerDisconnected: (callback: () => void) => void;
  onError: (callback: (error: unknown) => void) => void;
  disconnect: () => void;
};

export function connectAsFollower({
  userId,
  tripId,
  stopLat,
  stopLng,
}: ConnectAsFollowerParams): PassengerTripTracker {
  if (!SOCKET_URL) {
    throw new Error('EXPO_PUBLIC_SOCKET_URL não configurada.');
  }

  const socket = io(SOCKET_URL, {
    transports: ['websocket'],
    query: {
      user_id: userId,
      trip_id: tripId,
      role: 'follower',
    },
  });

  socket.on('connect', () => {
    socket.emit('join_session', {
      trip_id: tripId,
      role: 'follower',
      stop_lat: stopLat,
      stop_lng: stopLng,
    });
  });

  return {
    socket,
    onSessionJoined: (callback) => socket.on('session_joined', callback),
    onLocationUpdate: (callback) => socket.on('location_update', callback),
    onDriverEta: (callback) => socket.on('driver_eta', callback),
    onTripFinished: (callback) => socket.on('trip_finished', callback),
    onTrackerDisconnected: (callback) => socket.on('tracker_disconnected', callback),
    onError: (callback) => socket.on('error', callback),
    disconnect: () => socket.disconnect(),
  };
}
