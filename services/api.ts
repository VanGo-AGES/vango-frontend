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
    headers: { ...headers },
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
    headers: { 'Content-Type': 'application/json', ...headers },
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
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: { ...headers },
  });

  return handleResponse<TResponse>(response);
}

export async function apiUpload<TResponse>(path: string, formData: FormData): Promise<TResponse> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse<TResponse>(response);
}
