import { useSessionStore } from '@/store/session.store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// TK28 — injeta o JWT como `Authorization: Bearer <access_token>` em todas as
// chamadas. O token é lido do store de sessão (persistido pela TK12). Sem token
// (sessão ausente), nenhum header de auth é anexado.
function authHeaders(): Record<string, string> {
  const accessToken = useSessionStore.getState().accessToken;
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
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
  const response = await fetch(`${BASE_URL}${path}`, {
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
  const response = await fetch(`${BASE_URL}${path}`, {
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
  const response = await fetch(`${BASE_URL}${path}`, {
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
  body?: any,
  headers?: Record<string, string>,
): Promise<TResponse> {
  const requestHeaders: Record<string, string> = {
    ...authHeaders(),
    ...headers,
  };
  if (body && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json';
  }
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<TResponse>(response);
}

export async function apiUpload<TResponse>(path: string, formData: FormData): Promise<TResponse> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    // Sem Content-Type manual: o fetch define o boundary do multipart.
    headers: { ...authHeaders() },
    body: formData,
  });

  return handleResponse<TResponse>(response);
}
