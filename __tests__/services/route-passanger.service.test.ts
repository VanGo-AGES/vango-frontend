import { mockFetch, fetchCalls } from '../setup/msw-server';
import { AUTH_HEADER, clearSession, seedSession } from '../setup/session';
import {
  validateRouteInviteSummaryResponse,
  validateRoutePassangerResponse,
} from '../setup/schema-validators';
import {
  acceptRequest,
  getPassangerRouteDetail,
  getRouteByInviteCode,
  joinRoute,
  leaveRoute,
  listPassangerRouteAbsences,
  listPassangerRoutes,
  rejectRequest,
  removePassanger,
} from '@/services/route-passanger.service';

const ROUTE_ID = 'aaaaaaaa-0000-0000-0000-000000000001';
const RP_ID = 'bbbbbbbb-0000-0000-0000-000000000002';

const ADDR = {
  id: 'cccc-cccc',
  label: 'Rua A',
  street: 'Rua A',
  number: '1',
  neighborhood: 'Centro',
  zip: '90000-000',
  city: 'POA',
  state: 'RS',
  latitude: null,
  longitude: null,
};

// Fixture conforming to RoutePassangerResponse schema
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

// Fixture conforming to RouteInviteSummaryResponse schema
const inviteSummaryFixture = {
  id: ROUTE_ID,
  name: 'Morning Route',
  recurrence: 'seg,qua,sex',
  expected_time: '07:30:00',
  max_passengers: 20,
  accepted_count: 5,
  route_type: 'fixed',
  origin_address: ADDR,
  destination_address: ADDR,
};

// Fixture conforming to RouteAbsenceResponse schema
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

describe('acceptRequest — POST /routes/:id/passangers/:rpId/accept', () => {
  it('returns a RoutePassangerResponse matching the OpenAPI schema', async () => {
    mockFetch([{ body: { ...rpFixture, status: 'accepted' } }]);

    const result = await acceptRequest(ROUTE_ID, RP_ID);

    validateRoutePassangerResponse(result);
    expect(result.status).toBe('accepted');
    expect(fetchCalls[0].url).toContain(`/routes/${ROUTE_ID}/passangers/${RP_ID}/accept`);
    expect(fetchCalls[0].method).toBe('POST');
    expect(fetchCalls[0].headers['Authorization']).toBe(AUTH_HEADER);
  });
});

describe('rejectRequest — POST /routes/:id/passangers/:rpId/reject', () => {
  it('returns a RoutePassangerResponse matching the OpenAPI schema', async () => {
    mockFetch([{ body: { ...rpFixture, status: 'rejected' } }]);

    const result = await rejectRequest(ROUTE_ID, RP_ID);

    validateRoutePassangerResponse(result);
    expect(result.status).toBe('rejected');
    expect(fetchCalls[0].url).toContain(`/routes/${ROUTE_ID}/passangers/${RP_ID}/reject`);
  });
});

describe('removePassanger — DELETE /routes/:id/passangers/:rpId', () => {
  it('returns undefined on 204', async () => {
    mockFetch([{ status: 204, body: null }]);

    const result = await removePassanger(ROUTE_ID, RP_ID);

    expect(result).toBeUndefined();
    expect(fetchCalls[0].method).toBe('DELETE');
    expect(fetchCalls[0].url).toContain(`/routes/${ROUTE_ID}/passangers/${RP_ID}`);
  });
});

describe('joinRoute — POST /routes/:id/passangers', () => {
  it('returns a RoutePassangerResponse matching the OpenAPI schema', async () => {
    mockFetch([{ status: 201, body: rpFixture }]);

    const result = await joinRoute(ROUTE_ID, {
      address: {
        label: 'Rua A',
        street: 'Rua A',
        number: '1',
        neighborhood: 'Centro',
        zip: '90000-000',
        city: 'POA',
        state: 'RS',
      },
      schedules: [],
    } as any);

    validateRoutePassangerResponse(result);
    expect(fetchCalls[0].url).toContain(`/routes/${ROUTE_ID}/passangers`);
    expect(fetchCalls[0].method).toBe('POST');
  });
});

describe('leaveRoute — DELETE /routes/:id/passangers/me', () => {
  it('returns undefined on 204', async () => {
    mockFetch([{ status: 204, body: null }]);

    const result = await leaveRoute(ROUTE_ID);

    expect(result).toBeUndefined();
    expect(fetchCalls[0].url).toContain(`/routes/${ROUTE_ID}/passangers/me`);
    expect(fetchCalls[0].url).not.toContain('dependent_id');
    expect(fetchCalls[0].method).toBe('DELETE');
  });

  it('appends ?dependent_id= when dependentId is provided', async () => {
    mockFetch([{ status: 204, body: null }]);

    await leaveRoute(ROUTE_ID, 'dep-1');

    expect(fetchCalls[0].url).toContain('dependent_id=dep-1');
  });
});

describe('listPassangerRoutes — GET /routes/me', () => {
  it('returns an array with Authorization header', async () => {
    mockFetch([{ body: [{ route_id: ROUTE_ID, route_name: 'R1' }] }]);

    const result = await listPassangerRoutes();

    expect(Array.isArray(result)).toBe(true);
    expect(fetchCalls[0].url).toContain('/routes/me');
    expect(fetchCalls[0].headers['Authorization']).toBe(AUTH_HEADER);
  });
});

describe('getPassangerRouteDetail — GET /routes/:id/me', () => {
  it('sends correct URL without dependent_id', async () => {
    mockFetch([{ body: { route_id: ROUTE_ID } }]);

    await getPassangerRouteDetail(ROUTE_ID);

    expect(fetchCalls[0].url).toContain(`/routes/${ROUTE_ID}/me`);
    expect(fetchCalls[0].url).not.toContain('dependent_id');
  });

  it('appends ?dependent_id= when provided', async () => {
    mockFetch([{ body: { route_id: ROUTE_ID } }]);

    await getPassangerRouteDetail(ROUTE_ID, 'dep-1');

    expect(fetchCalls[0].url).toContain('dependent_id=dep-1');
  });
});

describe('listPassangerRouteAbsences — GET /routes/:id/absences', () => {
  it('returns absences without date param', async () => {
    mockFetch([{ body: [absenceFixture] }]);

    const result = await listPassangerRouteAbsences(ROUTE_ID);

    expect(result).toHaveLength(1);
    expect(fetchCalls[0].url).not.toContain('date=');
  });

  it('appends ?date= when provided', async () => {
    mockFetch([{ body: [] }]);

    await listPassangerRouteAbsences(ROUTE_ID, '2025-06-10');

    expect(fetchCalls[0].url).toContain('date=2025-06-10');
  });
});

describe('getRouteByInviteCode — GET /routes/invite/:code', () => {
  it('returns a RouteInviteSummaryResponse matching the OpenAPI schema', async () => {
    mockFetch([{ body: inviteSummaryFixture }]);

    const result = await getRouteByInviteCode('ABC12');

    validateRouteInviteSummaryResponse(result);
    expect(fetchCalls[0].url).toContain('/routes/invite/ABC12');
  });

  it('encodes special characters in invite code', async () => {
    mockFetch([{ body: inviteSummaryFixture }]);

    await getRouteByInviteCode('A B+1');

    expect(fetchCalls[0].url).toContain('/routes/invite/A%20B%2B1');
  });

  it('throws ApiError(404) for unknown code', async () => {
    mockFetch([{ status: 404, body: { detail: 'Invite not found' } }]);

    await expect(getRouteByInviteCode('XXXXX')).rejects.toMatchObject({
      status: 404,
      detail: 'Invite not found',
    });
  });
});
