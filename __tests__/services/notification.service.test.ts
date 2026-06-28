import { mockFetch, fetchCalls } from '../setup/msw-server';
import { AUTH_HEADER, clearSession, seedSession } from '../setup/session';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Import after mocks ───────────────────────────────────────────────────────

import {
  configureNotificationChannel,
  getPushNotificationToken,
  registerPushToken,
  requestNotificationPermission,
} from '@/services/notification.service';

// ── Mocks for native modules ────────────────────────────────────────────────

const mockGetPermissionsAsync = jest.fn();
const mockRequestPermissionsAsync = jest.fn();
const mockSetNotificationChannelAsync = jest.fn();
const mockGetExpoPushTokenAsync = jest.fn();
const mockGetDevicePushTokenAsync = jest.fn();

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: (...args: unknown[]) => mockGetPermissionsAsync(...args),
  requestPermissionsAsync: (...args: unknown[]) => mockRequestPermissionsAsync(...args),
  setNotificationChannelAsync: (...args: unknown[]) => mockSetNotificationChannelAsync(...args),
  getExpoPushTokenAsync: (...args: unknown[]) => mockGetExpoPushTokenAsync(...args),
  getDevicePushTokenAsync: (...args: unknown[]) => mockGetDevicePushTokenAsync(...args),
  AndroidImportance: { MAX: 5 },
}));

let mockIsDevice = true;
jest.mock('expo-device', () => ({
  get isDevice() {
    return mockIsDevice;
  },
}));

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: { expoConfig: { extra: { eas: { projectId: 'test-project-id' } } } },
}));

// Mutable platform — tests can change mockPlatformOS to simulate Android
let mockPlatformOS = 'ios';
jest.mock('react-native', () => ({
  Platform: {
    get OS() {
      return mockPlatformOS;
    },
  },
}));

beforeEach(() => {
  seedSession();
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
});

afterEach(() => clearSession());

// ── configureNotificationChannel ────────────────────────────────────────────

describe('configureNotificationChannel', () => {
  it('does nothing on iOS (Platform.OS !== android)', async () => {
    await configureNotificationChannel();

    expect(mockSetNotificationChannelAsync).not.toHaveBeenCalled();
  });

  it('calls setNotificationChannelAsync on Android', async () => {
    mockPlatformOS = 'android';

    await configureNotificationChannel();

    mockPlatformOS = 'ios';

    expect(mockSetNotificationChannelAsync).toHaveBeenCalledWith(
      'default',
      expect.objectContaining({
        name: 'default',
      }),
    );
  });
});

// ── requestNotificationPermission ───────────────────────────────────────────

describe('requestNotificationPermission', () => {
  it('returns "granted" immediately when permission is already granted', async () => {
    mockGetPermissionsAsync.mockResolvedValue({ status: 'granted' });

    const result = await requestNotificationPermission();

    expect(result).toBe('granted');
    expect(mockRequestPermissionsAsync).not.toHaveBeenCalled();
  });

  it('requests permission and returns the result when not yet granted', async () => {
    mockGetPermissionsAsync.mockResolvedValue({ status: 'undetermined' });
    mockRequestPermissionsAsync.mockResolvedValue({ status: 'granted' });

    const result = await requestNotificationPermission();

    expect(mockRequestPermissionsAsync).toHaveBeenCalledTimes(1);
    expect(result).toBe('granted');
  });

  it('returns "denied" when user denies the request', async () => {
    mockGetPermissionsAsync.mockResolvedValue({ status: 'denied' });
    mockRequestPermissionsAsync.mockResolvedValue({ status: 'denied' });

    const result = await requestNotificationPermission();

    expect(result).toBe('denied');
  });
});

// ── getPushNotificationToken ─────────────────────────────────────────────────

describe('getPushNotificationToken', () => {
  it('returns not-a-device when not running on a real device', async () => {
    mockIsDevice = false;

    const result = await getPushNotificationToken();

    mockIsDevice = true;

    expect(result).toEqual({ token: null, reason: 'not-a-device' });
  });

  it('returns permission-denied when permission is not granted', async () => {
    mockGetPermissionsAsync.mockResolvedValue({ status: 'denied' });
    mockRequestPermissionsAsync.mockResolvedValue({ status: 'denied' });

    const result = await getPushNotificationToken();

    expect(result).toEqual({ token: null, reason: 'permission-denied' });
  });

  it('returns success with Expo push token on iOS', async () => {
    mockGetPermissionsAsync.mockResolvedValue({ status: 'granted' });
    mockGetExpoPushTokenAsync.mockResolvedValue({ data: 'ExponentPushToken[test]' });

    const result = await getPushNotificationToken();

    expect(result).toEqual({ token: 'ExponentPushToken[test]', reason: 'success' });
    expect(mockGetExpoPushTokenAsync).toHaveBeenCalledTimes(1);
  });

  it('returns token-unavailable when token fetch throws', async () => {
    mockGetPermissionsAsync.mockResolvedValue({ status: 'granted' });
    mockGetExpoPushTokenAsync.mockRejectedValue(new Error('token error'));

    const result = await getPushNotificationToken();

    expect(result).toEqual({ token: null, reason: 'token-unavailable' });
  });

  it('returns success with FCM device token on Android', async () => {
    mockPlatformOS = 'android';
    mockGetPermissionsAsync.mockResolvedValue({ status: 'granted' });
    mockGetDevicePushTokenAsync.mockResolvedValue({ data: 'fcm-device-token-android' });

    const result = await getPushNotificationToken();

    mockPlatformOS = 'ios';

    expect(result).toEqual({ token: 'fcm-device-token-android', reason: 'success' });
    expect(mockGetDevicePushTokenAsync).toHaveBeenCalledTimes(1);
    expect(mockGetExpoPushTokenAsync).not.toHaveBeenCalled();
  });
});

// ── registerPushToken ────────────────────────────────────────────────────────

describe('registerPushToken', () => {
  it('posts the token to /users/me/push-token with Bearer', async () => {
    mockFetch([{ status: 204, body: null }]);

    await registerPushToken('fcm-token-abc');

    expect(fetchCalls[0].url).toContain('/users/me/push-token');
    expect(fetchCalls[0].method).toBe('POST');
    expect(fetchCalls[0].headers['Authorization']).toBe(AUTH_HEADER);
    expect(fetchCalls[0].body).toEqual({ token: 'fcm-token-abc' });
  });

  it('persists the registration key to AsyncStorage after success', async () => {
    mockFetch([{ status: 204, body: null }]);

    await registerPushToken('fcm-token-abc');

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@vango:push:last-sent-token',
      expect.stringContaining('fcm-token-abc'),
    );
  });

  it('skips registration if token was already registered for this user', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('user-1:fcm-token-abc');

    await registerPushToken('fcm-token-abc');

    expect(fetchCalls).toHaveLength(0);
  });

  it('does nothing when token is empty string', async () => {
    await registerPushToken('');

    expect(fetchCalls).toHaveLength(0);
  });

  it('uses userId:token as registration key when user is in session', async () => {
    const { useSessionStore } = require('@/store/session.store');
    useSessionStore.getState().setUser({ id: 'user-42', name: 'Test' });
    mockFetch([{ status: 204, body: null }]);

    await registerPushToken('fcm-token-with-user');

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@vango:push:last-sent-token',
      'user-42:fcm-token-with-user',
    );

    useSessionStore.getState().clearSession();
  });

  it('uses token alone as registration key when no user in session', async () => {
    mockFetch([{ status: 204, body: null }]);

    await registerPushToken('fcm-solo-token');

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@vango:push:last-sent-token',
      'fcm-solo-token',
    );
  });

  it('fails silently when API call throws', async () => {
    mockFetch([{ status: 500, body: { detail: 'Server error' } }]);

    await expect(registerPushToken('fcm-token-xyz')).resolves.toBeUndefined();
  });
});
