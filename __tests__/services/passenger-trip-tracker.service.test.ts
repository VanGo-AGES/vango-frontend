// ── socket.io-client mock ─────────────────────────────────────────────────────

const mockEmit = jest.fn();
const mockDisconnect = jest.fn();
const eventHandlers: Record<string, ((...args: unknown[]) => void)[]> = {};

const mockSocket = {
  emit: mockEmit,
  disconnect: mockDisconnect,
  on: jest.fn((event: string, handler: (...args: unknown[]) => void) => {
    if (!eventHandlers[event]) eventHandlers[event] = [];
    eventHandlers[event].push(handler);
  }),
};

const mockIo = jest.fn(() => mockSocket);

jest.mock('socket.io-client', () => ({ io: mockIo }));

// ── Helpers ───────────────────────────────────────────────────────────────────

function emitEvent(event: string, ...args: unknown[]) {
  (eventHandlers[event] ?? []).forEach((h) => h(...args));
}

const USER_ID = 'user-333';
const TRIP_ID = 'trip-444';
const STOP_LAT = -30.123;
const STOP_LNG = -51.456;
const SOCKET_URL = 'ws://localhost:3000';

/**
 * Loads connectAsFollower with EXPO_PUBLIC_SOCKET_URL set to `url`.
 * Uses jest.isolateModules so each call gets a fresh module with the new env.
 */
function loadWithUrl(
  url: string | undefined,
): typeof import('@/services/passenger-trip-tracker.service').connectAsFollower {
  let fn: typeof import('@/services/passenger-trip-tracker.service').connectAsFollower;
  if (url === undefined) {
    delete process.env.EXPO_PUBLIC_SOCKET_URL;
  } else {
    process.env.EXPO_PUBLIC_SOCKET_URL = url;
  }
  jest.isolateModules(() => {
    fn = require('@/services/passenger-trip-tracker.service').connectAsFollower;
  });
  return fn!;
}

beforeEach(() => {
  jest.clearAllMocks();
  Object.keys(eventHandlers).forEach((k) => delete eventHandlers[k]);
});

afterAll(() => {
  delete process.env.EXPO_PUBLIC_SOCKET_URL;
});

// ── connectAsFollower ─────────────────────────────────────────────────────────

describe('connectAsFollower', () => {
  it('throws when EXPO_PUBLIC_SOCKET_URL is not set', () => {
    delete process.env.EXPO_PUBLIC_SOCKET_URL;
    const connectAsFollower = loadWithUrl(undefined);

    expect(() =>
      connectAsFollower({ userId: USER_ID, tripId: TRIP_ID, stopLat: null, stopLng: null }),
    ).toThrow('EXPO_PUBLIC_SOCKET_URL não configurada.');

    process.env.EXPO_PUBLIC_SOCKET_URL = SOCKET_URL;
  });

  it('calls io() with correct query params and websocket transport', () => {
    const connectAsFollower = loadWithUrl(SOCKET_URL);

    connectAsFollower({ userId: USER_ID, tripId: TRIP_ID, stopLat: STOP_LAT, stopLng: STOP_LNG });

    expect(mockIo).toHaveBeenCalledWith(SOCKET_URL, {
      transports: ['websocket'],
      query: { user_id: USER_ID, trip_id: TRIP_ID, role: 'follower' },
    });
  });

  it('emits join_session with stop coordinates on connect', () => {
    const connectAsFollower = loadWithUrl(SOCKET_URL);

    connectAsFollower({ userId: USER_ID, tripId: TRIP_ID, stopLat: STOP_LAT, stopLng: STOP_LNG });
    emitEvent('connect');

    expect(mockEmit).toHaveBeenCalledWith('join_session', {
      trip_id: TRIP_ID,
      role: 'follower',
      stop_lat: STOP_LAT,
      stop_lng: STOP_LNG,
    });
  });

  it('emits join_session with null coordinates when stop is unknown', () => {
    const connectAsFollower = loadWithUrl(SOCKET_URL);

    connectAsFollower({ userId: USER_ID, tripId: TRIP_ID, stopLat: null, stopLng: null });
    emitEvent('connect');

    expect(mockEmit).toHaveBeenCalledWith('join_session', {
      trip_id: TRIP_ID,
      role: 'follower',
      stop_lat: null,
      stop_lng: null,
    });
  });

  it('returns a PassengerTripTracker with socket reference', () => {
    const connectAsFollower = loadWithUrl(SOCKET_URL);

    const tracker = connectAsFollower({
      userId: USER_ID,
      tripId: TRIP_ID,
      stopLat: null,
      stopLng: null,
    });

    expect(tracker.socket).toBe(mockSocket);
  });
});

// ── event registration helpers ────────────────────────────────────────────────

describe('tracker event helpers', () => {
  let connectAsFollower: ReturnType<typeof loadWithUrl>;

  beforeEach(() => {
    connectAsFollower = loadWithUrl(SOCKET_URL);
  });

  function makeTracker() {
    return connectAsFollower({ userId: USER_ID, tripId: TRIP_ID, stopLat: null, stopLng: null });
  }

  it('onConnect registers connect listener and fires when event emitted', () => {
    const tracker = makeTracker();
    const cb = jest.fn();

    tracker.onConnect(cb);
    emitEvent('connect');

    expect(cb).toHaveBeenCalled();
  });

  it('onConnectError registers connect_error listener', () => {
    const tracker = makeTracker();
    const cb = jest.fn();
    const err = new Error('Connection refused');

    tracker.onConnectError(cb);
    emitEvent('connect_error', err);

    expect(cb).toHaveBeenCalledWith(err);
  });

  it('onSessionJoined fires with payload', () => {
    const tracker = makeTracker();
    const cb = jest.fn();
    const payload = { trip_id: TRIP_ID, tracker_online: true, last_location: null, eta: null };

    tracker.onSessionJoined(cb);
    emitEvent('session_joined', payload);

    expect(cb).toHaveBeenCalledWith(payload);
  });

  it('onLocationUpdate fires with location broadcast', () => {
    const tracker = makeTracker();
    const cb = jest.fn();
    const payload = { latitude: -30.0, longitude: -51.0, timestamp: '2025-01-01T00:00:00Z' };

    tracker.onLocationUpdate(cb);
    emitEvent('location_update', payload);

    expect(cb).toHaveBeenCalledWith(payload);
  });

  it('onDriverEta fires with ETA payload', () => {
    const tracker = makeTracker();
    const cb = jest.fn();
    const payload = { eta_seconds: 120, distance_meters: 500 };

    tracker.onDriverEta(cb);
    emitEvent('driver_eta', payload);

    expect(cb).toHaveBeenCalledWith(payload);
  });

  it('onTripFinished fires when trip_finished event is received', () => {
    const tracker = makeTracker();
    const cb = jest.fn();

    tracker.onTripFinished(cb);
    emitEvent('trip_finished');

    expect(cb).toHaveBeenCalled();
  });

  it('onTrackerDisconnected fires when tracker_disconnected event is received', () => {
    const tracker = makeTracker();
    const cb = jest.fn();

    tracker.onTrackerDisconnected(cb);
    emitEvent('tracker_disconnected');

    expect(cb).toHaveBeenCalled();
  });

  it('onError fires with error payload', () => {
    const tracker = makeTracker();
    const cb = jest.fn();
    const error = { code: 'E_UNKNOWN' };

    tracker.onError(cb);
    emitEvent('error', error);

    expect(cb).toHaveBeenCalledWith(error);
  });

  it('disconnect() calls socket.disconnect()', () => {
    const tracker = makeTracker();

    tracker.disconnect();

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
