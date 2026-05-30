import { io, Socket } from 'socket.io-client';
import type { DriverEtaPayload, TrackerLocationPayload } from '@/types/trip.types';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL || '';

class TripTrackerService {
  private socket: Socket | null = null;

  connectAsTracker(userId: string, tripId: string) {
    if (this.socket) this.disconnect();

    this.socket = io(SOCKET_URL, {
      query: { user_id: userId, trip_id: tripId, role: 'tracker' },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      this.socket?.emit('join_session', { trip_id: tripId, role: 'tracker' });
    });

    this.socket.on('session_joined', () => {});
  }

  emitLocationUpdate(payload: TrackerLocationPayload) {
    if (this.socket?.connected) {
      this.socket.emit('location_update', payload);
    }
  }

  onDriverEta(callback: (payload: DriverEtaPayload) => void) {
    this.socket?.on('driver_eta', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const tripTrackerService = new TripTrackerService();
