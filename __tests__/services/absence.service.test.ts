import { mockFetch, fetchCalls } from '../setup/msw-server';
import { AUTH_HEADER, clearSession, seedSession } from '../setup/session';
import { validateAbsenceResponse } from '../setup/schema-validators';
import { reportAbsence } from '@/services/absence.service';

// Fixture conforming to OpenAPI AbsenceResponse schema
const absenceFixture = {
  id: 'aaaaaaaa-0000-0000-0000-000000000001',
  route_passanger_id: 'bbbbbbbb-0000-0000-0000-000000000002',
  absence_date: '2025-06-10T00:00:00Z',
  created_at: '2025-06-10T06:00:00Z',
  reason: 'sick',
  trip_id: null,
};

beforeEach(() => seedSession());
afterEach(() => clearSession());

describe('reportAbsence — POST /absences', () => {
  it('returns an AbsenceResponse matching the OpenAPI schema', async () => {
    mockFetch([{ status: 201, body: absenceFixture }]);

    const result = await reportAbsence({
      route_id: 'route-1',
      absence_date: '2025-06-10',
      reason: 'sick',
    });

    validateAbsenceResponse(result);
    expect(result.id).toBe(absenceFixture.id);
    expect(result.reason).toBe('sick');
    expect(fetchCalls[0].url).toContain('/absences');
    expect(fetchCalls[0].method).toBe('POST');
    expect(fetchCalls[0].headers['Authorization']).toBe(AUTH_HEADER);
  });

  it('sends the full body including optional fields when provided', async () => {
    mockFetch([{ status: 201, body: absenceFixture }]);

    await reportAbsence({
      route_id: 'route-1',
      absence_date: '2025-06-10',
      dependent_id: 'dep-1',
      reason: 'travel',
    });

    expect(fetchCalls[0].body).toMatchObject({
      route_id: 'route-1',
      absence_date: '2025-06-10',
      dependent_id: 'dep-1',
      reason: 'travel',
    });
  });

  it('sends body without optional fields when they are absent', async () => {
    mockFetch([{ status: 201, body: absenceFixture }]);

    await reportAbsence({ route_id: 'route-1', absence_date: '2025-06-10' });

    expect(fetchCalls[0].body).not.toHaveProperty('dependent_id');
    expect(fetchCalls[0].body).not.toHaveProperty('reason');
  });

  it('throws ApiError(409) when absence already reported', async () => {
    mockFetch([{ status: 409, body: { detail: 'Absence already reported' } }]);

    await expect(
      reportAbsence({ route_id: 'route-1', absence_date: '2025-06-10' }),
    ).rejects.toMatchObject({ status: 409, detail: 'Absence already reported' });
  });

  it('throws ApiError(422) when absence date not allowed', async () => {
    mockFetch([{ status: 422, body: { detail: 'Absence date not allowed' } }]);

    await expect(
      reportAbsence({ route_id: 'route-1', absence_date: '2020-01-01' }),
    ).rejects.toMatchObject({ status: 422 });
  });
});
