import { mockFetch, fetchCalls } from '../setup/msw-server';
import { AUTH_HEADER, clearSession, seedSession } from '../setup/session';
import { validateDependentResponse } from '../setup/schema-validators';
import {
  createDependent,
  deleteDependent,
  listDependents,
  updateDependent,
} from '@/services/dependents.service';

const dependentFixture = {
  id: 'dddddddd-0000-0000-0000-000000000001',
  name: 'João Filho',
  guardian_id: 'user-1',
  created_at: '2025-01-01T00:00:00Z',
};

beforeEach(() => seedSession());
afterEach(() => clearSession());

describe('listDependents — GET /dependents/', () => {
  it('returns an array of DependentResponse with Bearer', async () => {
    mockFetch([{ body: [dependentFixture] }]);

    const result = await listDependents();

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
    validateDependentResponse(result[0]);
    expect(fetchCalls[0].url).toContain('/dependents/');
    expect(fetchCalls[0].method).toBe('GET');
    expect(fetchCalls[0].headers['Authorization']).toBe(AUTH_HEADER);
  });

  it('returns empty array when there are no dependents', async () => {
    mockFetch([{ body: [] }]);

    const result = await listDependents();

    expect(result).toEqual([]);
  });
});

describe('createDependent — POST /dependents/', () => {
  it('returns a DependentResponse matching the OpenAPI schema', async () => {
    mockFetch([{ status: 201, body: dependentFixture }]);

    const result = await createDependent({ name: 'João Filho' });

    validateDependentResponse(result);
    expect(result.name).toBe('João Filho');
    expect(fetchCalls[0].url).toContain('/dependents/');
    expect(fetchCalls[0].method).toBe('POST');
    expect(fetchCalls[0].headers['Authorization']).toBe(AUTH_HEADER);
    expect(fetchCalls[0].body).toMatchObject({ name: 'João Filho' });
  });
});

describe('updateDependent — PUT /dependents/:id', () => {
  it('returns an updated DependentResponse', async () => {
    const updated = { ...dependentFixture, name: 'João Atualizado' };
    mockFetch([{ body: updated }]);

    const result = await updateDependent(dependentFixture.id, { name: 'João Atualizado' });

    validateDependentResponse(result);
    expect(result.name).toBe('João Atualizado');
    expect(fetchCalls[0].url).toContain(`/dependents/${dependentFixture.id}`);
    expect(fetchCalls[0].method).toBe('PUT');
    expect(fetchCalls[0].body).toMatchObject({ name: 'João Atualizado' });
  });
});

describe('deleteDependent — DELETE /dependents/:id', () => {
  it('returns undefined on 204', async () => {
    mockFetch([{ status: 204, body: null }]);

    const result = await deleteDependent(dependentFixture.id);

    expect(result).toBeUndefined();
    expect(fetchCalls[0].url).toContain(`/dependents/${dependentFixture.id}`);
    expect(fetchCalls[0].method).toBe('DELETE');
    expect(fetchCalls[0].headers['Authorization']).toBe(AUTH_HEADER);
  });
});
