const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string | string[],
  ) {
    super(typeof detail === 'string' ? detail : detail.join(', '));
    this.name = 'ApiError';
  }

  get detailAsString(): string {
    return typeof this.detail === 'string' ? this.detail : this.detail.join(', ');
  }
}

export async function apiPost<TBody, TResponse>(
  path: string,
  body: TBody,
  headers?: Record<string, string>,
): Promise<TResponse> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Erro inesperado' }));
    const detail = error.detail ?? error.message ?? 'Erro inesperado';
    throw new ApiError(response.status, detail);
  }

  return await response.json();
}
