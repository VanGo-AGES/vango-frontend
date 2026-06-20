import { mockFetch, fetchCalls } from '../setup/msw-server';
import { AUTH_HEADER, clearSession, seedSession } from '../setup/session';
import {
  validateCurrentTripResponse,
  validateTripPassangerResponse,
  validateTripResponse,
} from '../setup/schema-validators';
import {
  alightPassanger,
  boardPassanger,
  finishTrip,
  getCurrentTrip,
  getDriverCurrentTrip,
  getTrip,
  getTripNextStop,
  markPassangerAbsent,
  skipStop,
  startTrip,
} from '@/services/trip.service';

const ROUTE_ID = 'aaaaaaaa-0000-0000-0000-000000000001';
const TRIP_ID = 'bbbbbbbb-0000-0000-0000-000000000002';
const TP_ID = 'cccccccc-0000-0000-0000-000000000003';
const STOP_ID = 'dddddddd-0000-0000-0000-000000000004';
const VEHICLE_ID = 'eeeeeeee-0000-0000-0000-000000000005';

// Fixtures conforming to OpenAPI TripResponse schema
const tripFixture = {
  id: TRIP_ID,
  route_id: ROUTE_ID,
  route_name: 'Morning Route',
  status: 'iniciada',
  vehicle_id: VEHICLE_ID,
  trip_date: '2025-06-10T07:30:00Z',
  started_at: '2025-06-10T07:31:00Z',
  finished_at: null,
  total_km: null,
  trip_passangers: [],
};

// Fixture conforming to TripPassangerResponse schema
const tpFixture = {
  id: TP_ID,
  passanger_name: 'Maria',
  pickup_address_label: 'Rua A, 123',
  route_passanger_id: 'rp-1',
  status: 'pendente',
  user_phone: '+5551988888888',
  boarded_at: null,
  alighted_at: null,
  photo_url: null,
};

// Fixture conforming to CurrentTripResponse schema
const currentTripFixture = {
  trip_id: TRIP_ID,
  status: 'iniciada',
  driver_name: 'João',
  driver_photo_url: null,
  started_at: '2025-06-10T07:31:00Z',
  vehicle_plate: 'ABC-1234',
};

// Fixture conforming to TripNextStopResponse schema
const nextStopFixture = {
  stop_id: STOP_ID,
  trip_passanger_id: TP_ID,
  address_label: 'Rua B, 456',
  order_index: 2,
  passanger_name: 'Maria',
  passanger_phone: '+5551988888888',
  trip_passanger_status: 'pendente',
  latitude: null,
  longitude: null,
};

beforeEach(() => seedSession());
afterEach(() => clearSession());

describe('startTrip — POST /routes/:id/trips', () => {
  it('returns a TripResponse matching the OpenAPI schema', async () => {
    mockFetch([{ body: tripFixture }]);

    const result = await startTrip(ROUTE_ID, { vehicle_id: VEHICLE_ID });

    validateTripResponse(result);
    expect(result.id).toBe(TRIP_ID);
    expect(result.status).toBe('iniciada');
    expect(fetchCalls[0].url).toContain(`/routes/${ROUTE_ID}/trips`);
    expect(fetchCalls[0].method).toBe('POST');
    expect(fetchCalls[0].headers['Authorization']).toBe(AUTH_HEADER);
    expect(fetchCalls[0].body).toMatchObject({ vehicle_id: VEHICLE_ID });
  });

  it('throws ApiError(409) when trip already in progress', async () => {
    mockFetch([{ status: 409, body: { detail: 'Trip already in progress' } }]);

    await expect(startTrip(ROUTE_ID, { vehicle_id: VEHICLE_ID })).rejects.toMatchObject({
      status: 409,
      detail: 'Trip already in progress',
    });
  });
});

describe('getTrip — GET /trips/:id', () => {
  it('returns a TripResponse matching the OpenAPI schema', async () => {
    mockFetch([{ body: tripFixture }]);

    const result = await getTrip(TRIP_ID);

    validateTripResponse(result);
    expect(fetchCalls[0].url).toContain(`/trips/${TRIP_ID}`);
    expect(fetchCalls[0].method).toBe('GET');
    expect(fetchCalls[0].headers['Authorization']).toBe(AUTH_HEADER);
  });
});

describe('getCurrentTrip — GET /routes/:id/trips/current', () => {
  it('returns a CurrentTripResponse matching the OpenAPI schema', async () => {
    mockFetch([{ body: currentTripFixture }]);

    const result = await getCurrentTrip(ROUTE_ID);

    validateCurrentTripResponse(result);
    expect(result.trip_id).toBe(TRIP_ID);
    expect(fetchCalls[0].url).toContain(`/routes/${ROUTE_ID}/trips/current`);
    expect(fetchCalls[0].url).not.toContain('dependent_id');
  });

  it('appends ?dependent_id= when dependentId is provided', async () => {
    mockFetch([{ body: currentTripFixture }]);

    await getCurrentTrip(ROUTE_ID, 'dep-1');

    expect(fetchCalls[0].url).toContain('dependent_id=dep-1');
  });
});

describe('getDriverCurrentTrip — GET /routes/:id/trips/current (driver)', () => {
  it('sends Bearer token', async () => {
    mockFetch([{ body: currentTripFixture }]);

    await getDriverCurrentTrip(ROUTE_ID);

    expect(fetchCalls[0].headers['Authorization']).toBe(AUTH_HEADER);
    expect(fetchCalls[0].url).toContain(`/routes/${ROUTE_ID}/trips/current`);
  });
});

describe('getTripNextStop — GET /trips/:id/next-stop', () => {
  it('returns a TripNextStopResponse matching the OpenAPI schema', async () => {
    mockFetch([{ body: nextStopFixture }]);

    const result = await getTripNextStop(TRIP_ID);

    // validateTripNextStopResponse inline (order_index is number per schema)
    expect(typeof result!.stop_id).toBe('string');
    expect(typeof result!.order_index).toBe('number');
    expect(typeof result!.passanger_name).toBe('string');
    expect(fetchCalls[0].url).toContain(`/trips/${TRIP_ID}/next-stop`);
  });

  it('returns undefined when 204 (no active next stop)', async () => {
    mockFetch([{ status: 204, body: null }]);

    const result = await getTripNextStop(TRIP_ID);
    // api.ts handleResponse returns undefined for 204 — service types it as null but runtime is undefined
    expect(result).toBeUndefined();
  });
});

describe('boardPassanger — POST /trips/:id/passangers/:tpId/board', () => {
  it('returns a TripPassangerResponse matching the OpenAPI schema', async () => {
    mockFetch([{ body: { ...tpFixture, status: 'presente' } }]);

    const result = await boardPassanger(TRIP_ID, TP_ID);

    validateTripPassangerResponse(result);
    expect(result.status).toBe('presente');
    expect(fetchCalls[0].url).toContain(`/trips/${TRIP_ID}/passangers/${TP_ID}/board`);
    expect(fetchCalls[0].method).toBe('POST');
  });
});

describe('markPassangerAbsent — POST /trips/:id/passangers/:tpId/absent', () => {
  it('returns a TripPassangerResponse matching the OpenAPI schema', async () => {
    mockFetch([{ body: { ...tpFixture, status: 'ausente' } }]);

    const result = await markPassangerAbsent(TRIP_ID, TP_ID);

    validateTripPassangerResponse(result);
    expect(result.status).toBe('ausente');
    expect(fetchCalls[0].url).toContain(`/trips/${TRIP_ID}/passangers/${TP_ID}/absent`);
  });
});

describe('alightPassanger — POST /trips/:id/passangers/:tpId/alight', () => {
  it('returns a TripPassangerResponse matching the OpenAPI schema', async () => {
    mockFetch([{ body: { ...tpFixture, status: 'ausente' } }]);

    const result = await alightPassanger(TRIP_ID, TP_ID);

    validateTripPassangerResponse(result);
    expect(fetchCalls[0].url).toContain(`/trips/${TRIP_ID}/passangers/${TP_ID}/alight`);
  });
});

describe('skipStop — POST /trips/:id/stops/:stopId/skip', () => {
  it('returns an array of TripPassangerResponse matching the OpenAPI schema', async () => {
    mockFetch([{ body: [tpFixture] }]);

    const result = await skipStop(TRIP_ID, STOP_ID);

    expect(Array.isArray(result)).toBe(true);
    validateTripPassangerResponse(result[0]);
    expect(fetchCalls[0].url).toContain(`/trips/${TRIP_ID}/stops/${STOP_ID}/skip`);
    expect(fetchCalls[0].method).toBe('POST');
  });
});

describe('finishTrip — POST /trips/:id/finish', () => {
  it('returns a TripResponse matching the OpenAPI schema with total_km', async () => {
    mockFetch([{ body: { ...tripFixture, status: 'finalizada', total_km: 12.5 } }]);

    const result = await finishTrip(TRIP_ID, { total_km: 12.5 });

    validateTripResponse(result);
    expect(result.status).toBe('finalizada');
    expect(fetchCalls[0].body).toEqual({ total_km: 12.5 });
    expect(fetchCalls[0].url).toContain(`/trips/${TRIP_ID}/finish`);
    expect(fetchCalls[0].method).toBe('POST');
  });

  it('defaults total_km to null when called without args', async () => {
    mockFetch([{ body: { ...tripFixture, status: 'finalizada' } }]);

    await finishTrip(TRIP_ID);

    expect(fetchCalls[0].body).toEqual({ total_km: null });
  });
});
