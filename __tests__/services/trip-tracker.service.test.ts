// ── socket.io-client mock ─────────────────────────────────────────────────────

// ── Import after mock ─────────────────────────────────────────────────────────

import { io } from 'socket.io-client';
import { tripTrackerService } from '@/services/trip-tracker.service';

const mockEmit = jest.fn();
const mockOn = jest.fn();
const mockDisconnect = jest.fn();

let mockConnected = true;
let capturedConnectHandler: (() => void) | null = null;

const mockSocket = {
  get connected() {
    return mockConnected;
  },
  emit: mockEmit,
  on: jest.fn((event: string, handler: (...args: unknown[]) => void) => {
    if (event === 'connect') capturedConnectHandler = handler;
    mockOn(event, handler);
  }),
  disconnect: mockDisconnect,
};

jest.mock('socket.io-client', () => ({
  io: jest.fn(() => mockSocket),
}));

const USER_ID = 'user-111';
const TRIP_ID = 'trip-222';

beforeEach(() => {
  jest.clearAllMocks();
  mockConnected = true;
  capturedConnectHandler = null;
  // Ensure a clean state before each test
  tripTrackerService.disconnect();
});

// ── connectAsTracker ──────────────────────────────────────────────────────────

describe('connectAsTracker', () => {
  it('calls io() with correct query params and websocket transport', () => {
    tripTrackerService.connectAsTracker(USER_ID, TRIP_ID);

    expect(io).toHaveBeenCalledWith(expect.any(String), {
      query: { user_id: USER_ID, trip_id: TRIP_ID, role: 'tracker' },
      transports: ['websocket'],
    });
  });

  it('emits join_session with trip_id and role on connect event', () => {
    tripTrackerService.connectAsTracker(USER_ID, TRIP_ID);

    // Simulate the connect event firing
    capturedConnectHandler?.();

    expect(mockEmit).toHaveBeenCalledWith('join_session', {
      trip_id: TRIP_ID,
      role: 'tracker',
    });
  });

  it('disconnects an existing socket before creating a new one', () => {
    tripTrackerService.connectAsTracker(USER_ID, TRIP_ID);
    // Reset call count after first connect so we only count the disconnect from the second connect
    mockDisconnect.mockClear();

    tripTrackerService.connectAsTracker(USER_ID, 'trip-new');

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});

// ── emitLocationUpdate ────────────────────────────────────────────────────────

describe('emitLocationUpdate', () => {
  it('emits location_update when socket is connected', () => {
    tripTrackerService.connectAsTracker(USER_ID, TRIP_ID);
    mockConnected = true;

    const payload = { trip_id: TRIP_ID, lat: -30.0, lng: -51.0 };
    tripTrackerService.emitLocationUpdate(payload);

    expect(mockEmit).toHaveBeenCalledWith('location_update', payload);
  });

  it('does not emit when socket is disconnected', () => {
    tripTrackerService.connectAsTracker(USER_ID, TRIP_ID);
    mockConnected = false;

    tripTrackerService.emitLocationUpdate({
      trip_id: TRIP_ID,
      lat: -30.0,
      lng: -51.0,
    });

    // Only the join_session emit from connectAsTracker (if connect fired), not location_update
    const locationCalls = mockEmit.mock.calls.filter(([event]) => event === 'location_update');
    expect(locationCalls).toHaveLength(0);
  });

  it('does nothing when socket is null (never connected)', () => {
    // Fresh service state — disconnect clears socket
    tripTrackerService.disconnect();

    expect(() =>
      tripTrackerService.emitLocationUpdate({ trip_id: TRIP_ID, lat: 0, lng: 0 }),
    ).not.toThrow();
  });
});

// ── onDriverEta ───────────────────────────────────────────────────────────────

describe('onDriverEta', () => {
  it('registers a driver_eta listener on the socket', () => {
    tripTrackerService.connectAsTracker(USER_ID, TRIP_ID);

    const callback = jest.fn();
    tripTrackerService.onDriverEta(callback);

    expect(mockOn).toHaveBeenCalledWith('driver_eta', callback);
  });

  it('does nothing when socket is null', () => {
    tripTrackerService.disconnect();

    expect(() => tripTrackerService.onDriverEta(jest.fn())).not.toThrow();
  });
});

// ── disconnect ────────────────────────────────────────────────────────────────

describe('disconnect', () => {
  it('calls socket.disconnect() and nullifies internal socket', () => {
    tripTrackerService.connectAsTracker(USER_ID, TRIP_ID);
    tripTrackerService.disconnect();

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it('is idempotent — calling twice does not throw', () => {
    tripTrackerService.connectAsTracker(USER_ID, TRIP_ID);
    tripTrackerService.disconnect();

    expect(() => tripTrackerService.disconnect()).not.toThrow();
  });
});

describe('session_joined listener', () => {
  it('registers session_joined event listener on connect', () => {
    tripTrackerService.connectAsTracker(USER_ID, TRIP_ID);

    const sessionJoinedCalls = mockOn.mock.calls.filter(([event]) => event === 'session_joined');
    expect(sessionJoinedCalls.length).toBeGreaterThan(0);
  });
});
