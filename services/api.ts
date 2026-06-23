import { useSessionStore } from '@/store/session.store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// TK28 — injeta o JWT como `Authorization: Bearer <access_token>` em todas as
// chamadas. O token é lido do store de sessão (persistido pela TK12). Sem token
// (sessão ausente), nenhum header de auth é anexado.
function authHeaders(overrideToken?: string): Record<string, string> {
  const accessToken = overrideToken ?? useSessionStore.getState().accessToken;
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

// Singleton promise para evitar múltiplos refreshes simultâneos.
// Se N requests levam 401 ao mesmo tempo, todas aguardam o mesmo refresh.
let refreshPromise: Promise<string | null> | null = null;

async function attemptTokenRefresh(): Promise<string | null> {
  const { refreshToken, setTokens, clearSession } = useSessionStore.getState();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      clearSession();
      return null;
    }

    const data = await response.json();
    setTokens(data.access_token, data.refresh_token ?? null);
    return data.access_token;
  } catch {
    clearSession();
    return null;
  }
}

async function getRefreshedToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = attemptTokenRefresh().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

// Wrapper sobre fetch que intercepta 401, tenta refresh e retenta uma vez.
// O endpoint /auth/refresh nunca é retentado (evita loop infinito).
async function apiFetch(url: string, init: RequestInit): Promise<Response> {
  const response = await fetch(url, init);

  if (response.status !== 401 || url.includes('/auth/refresh')) {
    return response;
  }

  const newToken = await getRefreshedToken();
  if (!newToken) return response;

  return fetch(url, {
    ...init,
    headers: { ...init.headers, ...authHeaders(newToken) },
  });
}

/**
 * @deprecated TK28 — o mock `X-User-Id`/`X-User-Role` foi aposentado. A autenticação
 * agora é via `Authorization: Bearer` injetado centralmente nas funções abaixo.
 * Mantido como no-op para não quebrar os call sites existentes.
 */
export function getDriverHeaders(): Record<string, string> {
  return {};
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: unknown,
  ) {
    super(typeof detail === 'string' ? detail : 'Erro inesperado');
    this.name = 'ApiError';
  }
}

async function handleResponse<TResponse>(response: Response): Promise<TResponse> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Erro inesperado' }));
    throw new ApiError(response.status, error.detail ?? 'Erro inesperado');
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return await response.json();
}

export async function apiGet<TResponse>(
  path: string,
  headers?: Record<string, string>,
): Promise<TResponse> {
  const response = await apiFetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: { ...authHeaders(), ...headers },
  });

  return handleResponse<TResponse>(response);
}

export async function apiPost<TBody, TResponse>(
  path: string,
  body: TBody,
  headers?: Record<string, string>,
): Promise<TResponse> {
  const response = await apiFetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...headers },
    body: JSON.stringify(body),
  });

  return handleResponse<TResponse>(response);
}

export async function apiPut<TBody, TResponse>(
  path: string,
  body: TBody,
  headers?: Record<string, string>,
): Promise<TResponse> {
  const response = await apiFetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...headers,
    },
    body: JSON.stringify(body),
  });

  return handleResponse<TResponse>(response);
}

export async function apiDelete<TResponse>(
  path: string,
  headers?: Record<string, string>,
): Promise<TResponse> {
  const response = await apiFetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: { ...authHeaders(), ...headers },
  });

  return handleResponse<TResponse>(response);
}

export async function apiDeleteWithBody<TBody, TResponse>(
  path: string,
  body: TBody,
  headers?: Record<string, string>,
): Promise<TResponse> {
  const response = await apiFetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...authHeaders(), ...headers },
    body: JSON.stringify(body),
  });

  return handleResponse<TResponse>(response);
}

export async function apiUpload<TResponse>(path: string, formData: FormData): Promise<TResponse> {
  const response = await apiFetch(`${BASE_URL}${path}`, {
    method: 'POST',
    // Sem Content-Type manual: o fetch define o boundary do multipart.
    headers: { ...authHeaders() },
    body: formData,
  });

  return handleResponse<TResponse>(response);
}
