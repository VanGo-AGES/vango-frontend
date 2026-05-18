import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiPost } from './api';
import { useSessionStore } from '@/store/session.store';

export type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined';

export async function configureNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
  });
}

export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  const currentPermission = await Notifications.getPermissionsAsync();

  if (currentPermission.status === 'granted') {
    return 'granted';
  }

  const requestedPermission = await Notifications.requestPermissionsAsync();

  return requestedPermission.status as NotificationPermissionStatus;
}

export type PushNotificationTokenResult =
  | { token: string; reason: 'success' }
  | { token: null; reason: 'not-a-device' | 'permission-denied' };

export async function getPushNotificationToken(): Promise<PushNotificationTokenResult> {
  if (!Device.isDevice) {
    return { token: null, reason: 'not-a-device' };
  }

  await configureNotificationChannel();

  const permissionStatus = await requestNotificationPermission();

  if (permissionStatus !== 'granted') {
    return { token: null, reason: 'permission-denied' };
  }

  const devicePushToken = await Notifications.getDevicePushTokenAsync();
  return { token: devicePushToken.data, reason: 'success' };
}

const PUSH_LAST_SENT_KEY = '@vango:push:last-sent-token';

export async function registerPushToken(token: string): Promise<void> {
  try {
    if (!token) return;

    const last = await AsyncStorage.getItem(PUSH_LAST_SENT_KEY);
    if (last === token) return; // already registered

    // send to backend; backend is expected to accept { token }
    const user = useSessionStore.getState().user;
    const headers = {
      'X-User-Id': user?.id ?? '',
      'X-User-Role': user?.role ?? '',
    } as Record<string, string>;

    await apiPost<{ token: string }, void>('/users/me/push-token', { token }, headers);

    await AsyncStorage.setItem(PUSH_LAST_SENT_KEY, token);
  } catch (error) {
    // fail silently — do not block app usage
    // keep a lightweight debug log
    // eslint-disable-next-line no-console
    console.debug('registerPushToken failed', error);
  }
}
