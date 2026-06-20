// Sets up a controllable fetch mock for service integration tests.
// Each test uses `mockFetch` to configure responses; the mock is reset
// after every test so tests are fully isolated.

export interface MockFetchCall {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
}

let _mockImpl: ((url: string, init?: RequestInit) => Promise<Response>) | null = null;
export const fetchCalls: MockFetchCall[] = [];

// Build a fake Response object that mirrors the parts api.ts uses
function makeResponse(body: unknown, status: number): Response {
  const isNull = body === null;
  const jsonStr = isNull ? '' : JSON.stringify(body);

  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

export function mockFetch(responses: { status?: number; body?: unknown }[]): void {
  let callIndex = 0;
  _mockImpl = async (url: string, init?: RequestInit) => {
    const { status = 200, body = null } = responses[callIndex] ?? {};
    callIndex++;

    let parsedBody: unknown = undefined;
    if (init?.body && typeof init.body === 'string') {
      try {
        parsedBody = JSON.parse(init.body);
      } catch {
        parsedBody = init.body;
      }
    }

    fetchCalls.push({
      url,
      method: init?.method ?? 'GET',
      headers: Object.fromEntries(Object.entries((init?.headers as Record<string, string>) ?? {})),
      body: parsedBody,
    });

    return makeResponse(body, status);
  };
}

beforeAll(() => {
  process.env.EXPO_PUBLIC_API_URL = 'http://localhost';
  global.fetch = (url: string | URL | Request, init?: RequestInit) => {
    if (!_mockImpl) throw new Error('fetch called but no mock set — call mockFetch() first');
    return _mockImpl(url as string, init);
  };
});

beforeEach(() => {
  fetchCalls.length = 0;
  _mockImpl = null;
});
