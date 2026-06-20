import { useSessionStore } from '@/store/session.store';

export const TEST_TOKEN = 'test-access-token';
export const AUTH_HEADER = `Bearer ${TEST_TOKEN}`;

export function seedSession() {
  useSessionStore.getState().setTokens(TEST_TOKEN, null);
}

export function clearSession() {
  useSessionStore.getState().clearSession();
}
