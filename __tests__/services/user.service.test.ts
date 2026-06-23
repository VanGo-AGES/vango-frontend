import { mockFetch, fetchCalls } from '../setup/msw-server';
import { AUTH_HEADER, TEST_TOKEN, clearSession, seedSession } from '../setup/session';
import { validateLoginResponse, validateUserResponse } from '../setup/schema-validators';
import { ApiError } from '@/services/api';
import { createUser, getUser, loginUser, updateUser } from '@/services/user.service';

// Fixtures conforming to the OpenAPI contract
const userFixture = {
  id: 'a1b2c3d4-0000-0000-0000-000000000001',
  name: 'Test User',
  email: 'test@example.com',
  phone: '+5551999999999',
  cpf: null,
  role: 'driver',
  photo_url: null,
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
};

const loginFixture = {
  access_token: TEST_TOKEN,
  token_type: 'bearer',
  refresh_token: null,
  user: userFixture,
};

beforeEach(() => seedSession());
afterEach(() => clearSession());

describe('loginUser — POST /auth/login', () => {
  it('returns a LoginResponse matching the OpenAPI schema', async () => {
    mockFetch([{ body: loginFixture }]);

    const result = await loginUser({ email: 'test@example.com', password: 'secret' });

    validateLoginResponse(result);
    expect(result.access_token).toBe(TEST_TOKEN);
    expect(result.user.id).toBe(userFixture.id);
  });

  it('sends correct body and does not attach Bearer when session is empty', async () => {
    clearSession();
    mockFetch([{ body: loginFixture }]);

    await loginUser({ email: 'test@example.com', password: 'secret' });

    expect(fetchCalls[0].url).toContain('/auth/login');
    expect(fetchCalls[0].method).toBe('POST');
    expect(fetchCalls[0].body).toEqual({ email: 'test@example.com', password: 'secret' });
    expect(fetchCalls[0].headers['Authorization']).toBeUndefined();
  });

  it('throws ApiError(401) — detail preserved from response body', async () => {
    mockFetch([{ status: 401, body: { detail: 'Invalid credentials' } }]);

    await expect(loginUser({ email: 'bad@x.com', password: 'wrong' })).rejects.toMatchObject({
      name: 'ApiError',
      status: 401,
      detail: 'Invalid credentials',
    });
  });
});

describe('createUser — POST /users/', () => {
  it('returns a UserResponse matching the OpenAPI schema', async () => {
    mockFetch([{ status: 201, body: { ...userFixture, role: 'passenger' } }]);

    const result = await createUser({
      email: 'new@x.com',
      password: 'pass123',
      name: 'New User',
      phone: '+5551988888888',
      role: 'passenger',
    });

    validateUserResponse(result);
    expect(result.role).toBe('passenger');
    expect(fetchCalls[0].url).toContain('/users/');
    expect(fetchCalls[0].method).toBe('POST');
  });
});

describe('getUser — GET /users/:id', () => {
  it('returns a UserResponse matching the OpenAPI schema', async () => {
    mockFetch([{ body: userFixture }]);

    const result = await getUser(userFixture.id);

    validateUserResponse(result);
    expect(result.id).toBe(userFixture.id);
    expect(fetchCalls[0].url).toContain(`/users/${userFixture.id}`);
    expect(fetchCalls[0].method).toBe('GET');
    expect(fetchCalls[0].headers['Authorization']).toBe(AUTH_HEADER);
  });

  it('throws ApiError(404) — detail preserved', async () => {
    mockFetch([{ status: 404, body: { detail: 'User not found' } }]);

    await expect(getUser('missing-id')).rejects.toMatchObject({
      status: 404,
      detail: 'User not found',
    });
  });
});

describe('updateUser — PUT /users/:id', () => {
  it('returns a UserResponse matching the OpenAPI schema', async () => {
    mockFetch([{ body: { ...userFixture, name: 'Updated' } }]);

    const result = await updateUser(userFixture.id, { name: 'Updated' });

    validateUserResponse(result);
    expect(result.name).toBe('Updated');
    expect(fetchCalls[0].url).toContain(`/users/${userFixture.id}`);
    expect(fetchCalls[0].method).toBe('PUT');
    expect(fetchCalls[0].body).toMatchObject({ name: 'Updated' });
  });
});

describe('ApiError — generic parsing', () => {
  it('falls back to "Erro inesperado" when body has no detail field', async () => {
    mockFetch([{ status: 500, body: { message: 'oops' } }]);

    await expect(getUser('any')).rejects.toMatchObject({
      status: 500,
      detail: 'Erro inesperado',
    });
  });

  it('is instanceof ApiError', async () => {
    mockFetch([{ status: 422, body: { detail: 'Unprocessable' } }]);

    await expect(getUser('any')).rejects.toBeInstanceOf(ApiError);
  });
});
