import { mockFetch, fetchCalls } from '../setup/msw-server';
import { AUTH_HEADER, clearSession, seedSession } from '../setup/session';
import { validateMetricsReportResponse } from '../setup/schema-validators';
import { getTripReport } from '@/services/metrics.service';

// Fixture conforming to OpenAPI MetricsReportResponse schema
const reportFixture = {
  distance: 120.5,
  duration: 180,
  passengers: 45,
  trips: 12,
  period: 'week',
  start_date: '2025-06-02',
  end_date: '2025-06-08',
};

beforeEach(() => seedSession());
afterEach(() => clearSession());

describe('getTripReport — GET /metrics/reports', () => {
  it('returns a MetricsReportResponse matching the OpenAPI schema', async () => {
    mockFetch([{ body: reportFixture }]);

    const result = await getTripReport('week', '2025-06-02');

    validateMetricsReportResponse(result);
    expect(result.trips).toBe(12);
    expect(result.distance).toBe(120.5);
    expect(fetchCalls[0].url).toContain('/metrics/reports');
    expect(fetchCalls[0].method).toBe('GET');
    expect(fetchCalls[0].headers['Authorization']).toBe(AUTH_HEADER);
  });

  it('sends period and start_date as query params', async () => {
    mockFetch([{ body: reportFixture }]);

    await getTripReport('week', '2025-06-02');

    expect(fetchCalls[0].url).toContain('period=week');
    expect(fetchCalls[0].url).toContain('start_date=2025-06-02');
    expect(fetchCalls[0].url).not.toContain('end_date');
  });

  it('includes end_date query param when provided', async () => {
    mockFetch([{ body: reportFixture }]);

    await getTripReport('week', '2025-06-02', '2025-06-08');

    expect(fetchCalls[0].url).toContain('end_date=2025-06-08');
  });

  it('works for day period', async () => {
    mockFetch([
      {
        body: {
          ...reportFixture,
          period: 'day',
          trips: 1,
          start_date: '2025-06-10',
          end_date: '2025-06-10',
        },
      },
    ]);

    const result = await getTripReport('day', '2025-06-10');

    validateMetricsReportResponse(result);
    expect(result.period).toBe('day');
    expect(fetchCalls[0].url).toContain('period=day');
  });

  it('works for month period', async () => {
    mockFetch([
      {
        body: {
          ...reportFixture,
          period: 'month',
          start_date: '2025-06-01',
          end_date: '2025-06-30',
        },
      },
    ]);

    const result = await getTripReport('month', '2025-06-01');

    validateMetricsReportResponse(result);
    expect(fetchCalls[0].url).toContain('period=month');
  });

  it('throws ApiError(401) when not authenticated', async () => {
    mockFetch([{ status: 401, body: { detail: 'Unauthorized' } }]);

    await expect(getTripReport('day', '2025-06-10')).rejects.toMatchObject({ status: 401 });
  });
});
