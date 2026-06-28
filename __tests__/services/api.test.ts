import { mockFetch, fetchCalls } from '../setup/msw-server';
import { clearSession, seedSession, TEST_TOKEN } from '../setup/session';
import {
  ApiError,
  apiDelete,
  apiDeleteWithBody,
  apiGet,
  apiPost,
  apiPut,
  apiUpload,
  getDriverHeaders,
} from '@/services/api';
import { useSessionStore } from '@/store/session.store';

beforeEach(() => seedSession());
afterEach(() => clearSession());

describe('getDriverHeaders', () => {
  it('returns an empty object (deprecated no-op)', () => {
    expect(getDriverHeaders()).toEqual({});
  });
});

describe('ApiError', () => {
  it('sets name, status and detail from a string', () => {
    const err = new ApiError(400, 'Bad request');
    expect(err.name).toBe('ApiError');
    expect(err.status).toBe(400);
    expect(err.detail).toBe('Bad request');
    expect(err.message).toBe('Bad request');
  });

  it('uses "Erro inesperado" as message when detail is not a string', () => {
    const err = new ApiError(500, { nested: true });
    expect(err.message).toBe('Erro inesperado');
    expect(err.detail).toEqual({ nested: true });
  });
});

describe('apiGet', () => {
  it('sends GET with Bearer and returns parsed body', async () => {
    mockFetch([{ body: { id: '1' } }]);

    const result = await apiGet<{ id: string }>('/test');

    expect(fetchCalls[0].method).toBe('GET');
    expect(fetchCalls[0].url).toContain('/test');
    expect(fetchCalls[0].headers['Authorization']).toBe(`Bearer ${TEST_TOKEN}`);
    expect(result).toEqual({ id: '1' });
  });

  it('throws ApiError on non-2xx', async () => {
    mockFetch([{ status: 404, body: { detail: 'Not found' } }]);

    await expect(apiGet('/missing')).rejects.toMatchObject({ status: 404, detail: 'Not found' });
  });

  it('returns undefined for 204', async () => {
    mockFetch([{ status: 204, body: null }]);

    const result = await apiGet('/no-content');

    expect(result).toBeUndefined();
  });
});

describe('apiPost', () => {
  it('sends POST with JSON body and Bearer', async () => {
    mockFetch([{ status: 201, body: { ok: true } }]);

    const result = await apiPost('/items', { name: 'x' });

    expect(fetchCalls[0].method).toBe('POST');
    expect(fetchCalls[0].headers['Content-Type']).toBe('application/json');
    expect(fetchCalls[0].headers['Authorization']).toBe(`Bearer ${TEST_TOKEN}`);
    expect(fetchCalls[0].body).toEqual({ name: 'x' });
    expect(result).toEqual({ ok: true });
  });
});

describe('apiPut', () => {
  it('sends PUT with JSON body and Bearer', async () => {
    mockFetch([{ body: { updated: true } }]);

    const result = await apiPut('/items/1', { name: 'y' });

    expect(fetchCalls[0].method).toBe('PUT');
    expect(fetchCalls[0].headers['Content-Type']).toBe('application/json');
    expect(result).toEqual({ updated: true });
  });
});

describe('apiDelete', () => {
  it('sends DELETE with Bearer', async () => {
    mockFetch([{ status: 204, body: null }]);

    const result = await apiDelete('/items/1');

    expect(fetchCalls[0].method).toBe('DELETE');
    expect(fetchCalls[0].headers['Authorization']).toBe(`Bearer ${TEST_TOKEN}`);
    expect(result).toBeUndefined();
  });
});

describe('apiDeleteWithBody', () => {
  it('sends DELETE with JSON body and Bearer', async () => {
    mockFetch([{ status: 204, body: null }]);

    const result = await apiDeleteWithBody('/items/1', { confirm: true });

    expect(fetchCalls[0].method).toBe('DELETE');
    expect(fetchCalls[0].headers['Content-Type']).toBe('application/json');
    expect(fetchCalls[0].headers['Authorization']).toBe(`Bearer ${TEST_TOKEN}`);
    expect(fetchCalls[0].body).toEqual({ confirm: true });
    expect(result).toBeUndefined();
  });
});

describe('apiUpload', () => {
  it('sends POST with FormData and Bearer (no Content-Type override)', async () => {
    mockFetch([{ body: { url: 'https://example.com/photo.jpg' } }]);

    const formData = new FormData();
    formData.append('file', 'blob-data');

    const result = await apiUpload<{ url: string }>('/uploads/photo', formData);

    expect(fetchCalls[0].method).toBe('POST');
    expect(fetchCalls[0].headers['Authorization']).toBe(`Bearer ${TEST_TOKEN}`);
    expect(fetchCalls[0].headers['Content-Type']).toBeUndefined();
    expect(result).toEqual({ url: 'https://example.com/photo.jpg' });
  });
});

describe('authHeaders — no token', () => {
  it('does not attach Authorization when session is empty', async () => {
    clearSession();
    mockFetch([{ body: {} }]);

    await apiGet('/test');

    expect(fetchCalls[0].headers['Authorization']).toBeUndefined();
  });
});

describe('handleResponse — error fallback', () => {
  it('falls back to "Erro inesperado" when error body has no detail', async () => {
    mockFetch([{ status: 500, body: { message: 'oops' } }]);

    await expect(apiGet('/test')).rejects.toMatchObject({
      status: 500,
      detail: 'Erro inesperado',
    });
  });
});

describe('token refresh — 401 interception', () => {
  it('retries request with refreshed token after 401', async () => {
    const newToken = 'refreshed-token';

    // Inject a refreshToken so attemptTokenRefresh has something to work with
    useSessionStore.getState().setTokens(TEST_TOKEN, 'refresh-token-value');

    mockFetch([
      // 1st call: original request → 401
      { status: 401, body: { detail: 'Unauthorized' } },
      // 2nd call: POST /auth/refresh → 200 with new tokens
      { body: { access_token: newToken, refresh_token: 'new-refresh' } },
      // 3rd call: retry of original request → 200
      { body: { id: 'retried' } },
    ]);

    const result = await apiGet<{ id: string }>('/protected');

    expect(result).toEqual({ id: 'retried' });
    expect(fetchCalls).toHaveLength(3);
    expect(fetchCalls[1].url).toContain('/auth/refresh');
    expect(fetchCalls[2].headers['Authorization']).toBe(`Bearer ${newToken}`);
  });

  it('returns the 401 response when there is no refresh token', async () => {
    // No refresh token in session
    useSessionStore.getState().setTokens(TEST_TOKEN, null);

    mockFetch([{ status: 401, body: { detail: 'Unauthorized' } }]);

    await expect(apiGet('/protected')).rejects.toMatchObject({ status: 401 });
    expect(fetchCalls).toHaveLength(1);
  });

  it('clears session and returns 401 when refresh request fails', async () => {
    useSessionStore.getState().setTokens(TEST_TOKEN, 'refresh-token-value');

    mockFetch([
      { status: 401, body: { detail: 'Unauthorized' } },
      { status: 401, body: { detail: 'Invalid refresh token' } },
    ]);

    await expect(apiGet('/protected')).rejects.toMatchObject({ status: 401 });
    expect(useSessionStore.getState().accessToken).toBeNull();
  });

  it('does not retry /auth/refresh on 401 (avoids infinite loop)', async () => {
    useSessionStore.getState().setTokens(TEST_TOKEN, 'refresh-token-value');

    mockFetch([{ status: 401, body: { detail: 'Bad refresh' } }]);

    await expect(apiPost('/auth/refresh', {})).rejects.toMatchObject({ status: 401 });
    expect(fetchCalls).toHaveLength(1);
  });

  it('clears session and returns null when fetch throws during refresh', async () => {
    useSessionStore.getState().setTokens(TEST_TOKEN, 'refresh-token-value');

    // First call: 401 triggers refresh attempt
    // Second call (POST /auth/refresh): throws network error
    let callCount = 0;
    global.fetch = (url: string | URL | Request, init?: RequestInit) => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ detail: 'Unauthorized' }),
        } as unknown as Response);
      }
      return Promise.reject(new Error('Network error'));
    };

    await expect(apiGet('/protected')).rejects.toMatchObject({ status: 401 });
    expect(useSessionStore.getState().accessToken).toBeNull();
  });
});
