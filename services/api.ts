const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: unknown,
  ) {
    super(typeof detail === 'string' ? detail : 'Erro inesperado');
    this.name = 'ApiError';
  }
}

async function parseResponse<TResponse>(response: Response): Promise<TResponse> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Erro inesperado' }));
    throw new ApiError(response.status, error.detail ?? 'Erro inesperado');
  }
  return response.json();
}

export async function apiPost<TBody, TResponse>(
  path: string,
  body: TBody,
  headers?: Record<string, string>,
): Promise<TResponse> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  return parseResponse<TResponse>(response);
}

export async function apiPut<TBody, TResponse>(
  path: string,
  body: TBody,
  headers?: Record<string, string>,
): Promise<TResponse> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  return parseResponse<TResponse>(response);
}
