import { mockFetch, fetchCalls } from '../setup/msw-server';
import { AUTH_HEADER, clearSession, seedSession } from '../setup/session';
import {
  validateRouteAbsenceResponse,
  validateRoutePassangerResponse,
  validateRouteResponse,
} from '../setup/schema-validators';
import {
  createRoute,
  deleteRoute,
  getNextRouteOccurrenceDate,
  getRouteById,
  isRouteToday,
  listDriverRoutes,
  listRouteAbsences,
  listRoutePassangers,
  splitStopsByAbsence,
  updateRoute,
} from '@/services/route.service';

const ROUTE_ID = 'aaaaaaaa-0000-0000-0000-000000000001';
const RP_ID = 'bbbbbbbb-0000-0000-0000-000000000002';
const ADDR = {
  id: 'cccccccc-0000-0000-0000-000000000003',
  label: 'Rua A',
  street: 'Rua A',
  number: '100',
  neighborhood: 'Centro',
  zip: '90000-000',
  city: 'Porto Alegre',
  state: 'RS',
  latitude: null,
  longitude: null,
};

// Fixture conforming to OpenAPI RouteResponse schema
const routeFixture = {
  id: ROUTE_ID,
  name: 'Morning Route',
  recurrence: 'seg,qua,sex',
  expected_time: '07:30:00',
  invite_code: 'ABC12',
  max_passengers: 20,
  route_type: 'fixed',
  status: 'active',
  origin_address: ADDR,
  destination_address: ADDR,
  accepted_count: 5,
  stops: [],
  active_trip_id: null,
  total_distance_km: null,
  estimated_duration_min: null,
};

// Fixture conforming to OpenAPI RoutePassangerResponse schema
const rpFixture = {
  id: RP_ID,
  route_id: ROUTE_ID,
  user_id: 'user-1',
  user_name: 'Maria',
  user_phone: '+5551988888888',
  pickup_address_id: 'addr-1',
  requested_at: '2025-01-01T00:00:00Z',
  status: 'pending',
  photo_url: null,
  dependent_id: null,
  dependent_name: null,
  guardian_name: null,
  joined_at: null,
};

// Fixture conforming to OpenAPI RouteAbsenceResponse schema
const absenceFixture = {
  route_passanger_id: RP_ID,
  user_id: 'user-1',
  user_name: 'Maria',
  absence_date: '2025-06-10T00:00:00Z',
  dependent_id: null,
  dependent_name: null,
  reason: null,
};

beforeEach(() => seedSession());
afterEach(() => clearSession());

// ── HTTP ──────────────────────────────────────────────────────────────────────

describe('createRoute — POST /routes/', () => {
  it('returns a RouteResponse matching the OpenAPI schema', async () => {
    mockFetch([{ status: 201, body: routeFixture }]);

    const result = await createRoute({ name: 'Morning Route' } as any);

    validateRouteResponse(result);
    expect(result.id).toBe(ROUTE_ID);
    expect(fetchCalls[0].url).toContain('/routes/');
    expect(fetchCalls[0].method).toBe('POST');
    expect(fetchCalls[0].headers['Authorization']).toBe(AUTH_HEADER);
  });
});

describe('listDriverRoutes — GET /routes/', () => {
  it('returns an array of RouteResponse matching the OpenAPI schema', async () => {
    mockFetch([{ body: [routeFixture] }]);

    const result = await listDriverRoutes();

    expect(result).toHaveLength(1);
    validateRouteResponse(result[0]);
    expect(fetchCalls[0].method).toBe('GET');
  });
});

describe('getRouteById — GET /routes/:id', () => {
  it('returns a RouteResponse matching the OpenAPI schema', async () => {
    mockFetch([{ body: routeFixture }]);

    const result = await getRouteById(ROUTE_ID);

    validateRouteResponse(result);
    expect(fetchCalls[0].url).toContain(`/routes/${ROUTE_ID}`);
    expect(fetchCalls[0].headers['Authorization']).toBe(AUTH_HEADER);
  });

  it('throws ApiError(404) when route does not exist', async () => {
    mockFetch([{ status: 404, body: { detail: 'Route not found' } }]);

    await expect(getRouteById('missing')).rejects.toMatchObject({ status: 404 });
  });
});

describe('updateRoute — PUT /routes/:id', () => {
  it('returns a RouteResponse matching the OpenAPI schema', async () => {
    mockFetch([{ body: { ...routeFixture, name: 'Evening Route' } }]);

    const result = await updateRoute(ROUTE_ID, { name: 'Evening Route' } as any);

    validateRouteResponse(result);
    expect(result.name).toBe('Evening Route');
    expect(fetchCalls[0].method).toBe('PUT');
  });
});

describe('deleteRoute — DELETE /routes/:id', () => {
  it('returns undefined on 204', async () => {
    mockFetch([{ status: 204, body: null }]);

    const result = await deleteRoute(ROUTE_ID);

    expect(result).toBeUndefined();
    expect(fetchCalls[0].method).toBe('DELETE');
    expect(fetchCalls[0].url).toContain(`/routes/${ROUTE_ID}`);
  });
});

describe('listRouteAbsences — GET /routes/:id/absences', () => {
  it('returns an array of RouteAbsenceResponse matching the OpenAPI schema', async () => {
    mockFetch([{ body: [absenceFixture] }]);

    const result = await listRouteAbsences(ROUTE_ID);

    expect(result).toHaveLength(1);
    validateRouteAbsenceResponse(result[0]);
    expect(fetchCalls[0].url).not.toContain('date=');
  });

  it('appends ?date= query param when provided', async () => {
    mockFetch([{ body: [absenceFixture] }]);

    await listRouteAbsences(ROUTE_ID, '2025-06-10');

    expect(fetchCalls[0].url).toContain('date=2025-06-10');
  });
});

describe('listRoutePassangers — GET /routes/:id/passangers', () => {
  it('returns an array of RoutePassangerResponse matching the OpenAPI schema', async () => {
    mockFetch([{ body: [rpFixture] }]);

    const result = await listRoutePassangers(ROUTE_ID);

    expect(result).toHaveLength(1);
    validateRoutePassangerResponse(result[0]);
    expect(fetchCalls[0].url).not.toContain('status=');
  });

  it('appends ?status= when status is provided', async () => {
    mockFetch([{ body: [rpFixture] }]);

    await listRoutePassangers(ROUTE_ID, 'accepted' as any);

    expect(fetchCalls[0].url).toContain('status=accepted');
  });
});

// ── Pure functions ─────────────────────────────────────────────────────────────

describe('splitStopsByAbsence', () => {
  const stops = [
    { route_passanger_id: 'rp-1', label: 'Stop A' },
    { route_passanger_id: 'rp-2', label: 'Stop B' },
    { route_passanger_id: 'rp-3', label: 'Stop C' },
  ];
  const absences = [{ ...absenceFixture, route_passanger_id: 'rp-2' }];

  it('separates present and absent stops correctly', () => {
    const { present, absent } = splitStopsByAbsence(stops, absences);

    expect(present.map((s) => s.route_passanger_id)).toEqual(['rp-1', 'rp-3']);
    expect(absent.map((s) => s.route_passanger_id)).toEqual(['rp-2']);
  });

  it('returns all stops as present when no absences', () => {
    const { present, absent } = splitStopsByAbsence(stops, []);

    expect(present).toHaveLength(3);
    expect(absent).toHaveLength(0);
  });

  it('returns all stops as absent when all are absent', () => {
    const allAbsent = stops.map((s) => ({
      ...absenceFixture,
      route_passanger_id: s.route_passanger_id,
    }));
    const { present, absent } = splitStopsByAbsence(stops, allAbsent);

    expect(present).toHaveLength(0);
    expect(absent).toHaveLength(3);
  });

  it('preserves original objects (no mutation)', () => {
    const { present } = splitStopsByAbsence(stops, absences);
    expect(present[0]).toBe(stops[0]);
  });
});

describe('isRouteToday', () => {
  it('returns true when today weekday is in the recurrence string', () => {
    const dayNames = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const today = dayNames[new Date().getDay()];
    expect(isRouteToday(today)).toBe(true);
  });

  it('returns false for a single day that is not today', () => {
    // Find a day that is NOT today
    const allDays = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const todayIndex = new Date().getDay();
    const notToday = allDays[(todayIndex + 1) % 7];
    expect(isRouteToday(notToday)).toBe(false);
  });

  it('returns true when one of the comma-separated days matches today', () => {
    const allDays = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const todayName = allDays[new Date().getDay()];
    const recurrence = `seg,${todayName},sex`;
    expect(isRouteToday(recurrence)).toBe(true);
  });

  it('returns false for empty recurrence', () => {
    expect(isRouteToday('')).toBe(false);
  });

  it('returns false for invalid day names', () => {
    expect(isRouteToday('monday,tuesday')).toBe(false);
  });

  it('handles abbreviated day names (seg, ter, qua...)', () => {
    const abbrevs = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    const todayAbbrev = abbrevs[new Date().getDay()];
    expect(isRouteToday(todayAbbrev)).toBe(true);
  });
});

describe('getNextRouteOccurrenceDate', () => {
  it('returns today when today is in the recurrence', () => {
    const allDays = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const now = new Date();
    const todayName = allDays[now.getDay()];

    const result = getNextRouteOccurrenceDate(todayName, now);

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    expect(result).toBe(`${yyyy}-${mm}-${dd}`);
  });

  it('returns the next matching weekday when today is not in recurrence', () => {
    // Pin to a known date: Monday 2025-06-09
    const monday = new Date(2025, 5, 9); // June 9 2025 — Monday (getDay() === 1)

    // Recurrence: Wednesday only
    const result = getNextRouteOccurrenceDate('quarta', monday);

    // Next Wednesday from Monday = June 11 2025
    expect(result).toBe('2025-06-11');
  });

  it('returns null for empty recurrence', () => {
    expect(getNextRouteOccurrenceDate('')).toBeNull();
  });

  it('returns null for invalid day names', () => {
    expect(getNextRouteOccurrenceDate('monday')).toBeNull();
  });

  it('returns a YYYY-MM-DD formatted string', () => {
    const result = getNextRouteOccurrenceDate('seg');
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('wraps correctly at end of week — Sunday to next Sunday', () => {
    const sunday = new Date(2025, 5, 8); // June 8 2025 — Sunday
    const result = getNextRouteOccurrenceDate('domingo', sunday);
    expect(result).toBe('2025-06-08'); // same day
  });

  it('picks closest day among multiple options', () => {
    // Pin to Monday 2025-06-09
    const monday = new Date(2025, 5, 9);
    // quarta(Wed=+2) vs sexta(Fri=+4) → quarta is closer
    const result = getNextRouteOccurrenceDate('quarta,sexta', monday);
    expect(result).toBe('2025-06-11'); // Wednesday
  });
});
