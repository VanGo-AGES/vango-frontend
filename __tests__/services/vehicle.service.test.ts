import { mockFetch, fetchCalls } from '../setup/msw-server';
import { AUTH_HEADER, clearSession, seedSession } from '../setup/session';
import { validateVehicleResponse } from '../setup/schema-validators';
import { createVehicle, listVehicles, updateVehicle } from '@/services/vehicle.service';

const vehicleFixture = {
  id: 'vvvvvvvv-0000-0000-0000-000000000001',
  plate: 'ABC-1234',
  capacity: 4,
  notes: null,
  status: true,
  driver_id: 'user-1',
  created_at: '2025-01-01T00:00:00Z',
};

beforeEach(() => seedSession());
afterEach(() => clearSession());

describe('listVehicles — GET /vehicles/', () => {
  it('returns an array of VehicleResponse with Bearer', async () => {
    mockFetch([{ body: [vehicleFixture] }]);

    const result = await listVehicles();

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    validateVehicleResponse(result[0]);
    expect(fetchCalls[0].url).toContain('/vehicles/');
    expect(fetchCalls[0].method).toBe('GET');
    expect(fetchCalls[0].headers['Authorization']).toBe(AUTH_HEADER);
  });

  it('returns empty array when driver has no vehicles', async () => {
    mockFetch([{ body: [] }]);

    const result = await listVehicles();

    expect(result).toEqual([]);
  });
});

describe('createVehicle — POST /vehicles/', () => {
  it('returns a VehicleResponse matching the OpenAPI schema', async () => {
    mockFetch([{ status: 201, body: vehicleFixture }]);

    const result = await createVehicle({
      plate: 'ABC-1234',
      capacity: 4,
    });

    validateVehicleResponse(result);
    expect(result.plate).toBe('ABC-1234');
    expect(fetchCalls[0].url).toContain('/vehicles/');
    expect(fetchCalls[0].method).toBe('POST');
    expect(fetchCalls[0].headers['Authorization']).toBe(AUTH_HEADER);
    expect(fetchCalls[0].body).toMatchObject({ plate: 'ABC-1234', capacity: 4 });
  });
});

describe('updateVehicle — PUT /vehicles/:id', () => {
  it('returns an updated VehicleResponse', async () => {
    const updated = { ...vehicleFixture, notes: 'Veículo novo' };
    mockFetch([{ body: updated }]);

    const result = await updateVehicle(vehicleFixture.id, { notes: 'Veículo novo' });

    validateVehicleResponse(result);
    expect(result.notes).toBe('Veículo novo');
    expect(fetchCalls[0].url).toContain(`/vehicles/${vehicleFixture.id}`);
    expect(fetchCalls[0].method).toBe('PUT');
    expect(fetchCalls[0].headers['Authorization']).toBe(AUTH_HEADER);
    expect(fetchCalls[0].body).toMatchObject({ notes: 'Veículo novo' });
  });
});
