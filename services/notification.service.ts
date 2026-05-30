import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
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
  | { token: null; reason: 'not-a-device' | 'permission-denied' | 'token-unavailable' };

export async function getPushNotificationToken(): Promise<PushNotificationTokenResult> {
  if (!Device.isDevice) {
    return { token: null, reason: 'not-a-device' };
  }

  await configureNotificationChannel();

  const permissionStatus = await requestNotificationPermission();

  if (permissionStatus !== 'granted') {
    return { token: null, reason: 'permission-denied' };
  }

  try {
    // iOS: usa Expo Push token (entregue pelo Expo Push Service). O backend detecta
    // tokens Expo e envia pela API do Expo; o Android segue com o token FCM nativo.
    if (Platform.OS === 'ios') {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      const expoPushToken = await Notifications.getExpoPushTokenAsync({ projectId });
      return { token: expoPushToken.data, reason: 'success' };
    }

    // Android: getDevicePushTokenAsync já retorna o token FCM.
    const devicePushToken = await Notifications.getDevicePushTokenAsync();
    return { token: devicePushToken.data, reason: 'success' };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.debug('getPushNotificationToken failed', error);
    return { token: null, reason: 'token-unavailable' };
  }
}

const PUSH_LAST_SENT_KEY = '@vango:push:last-sent-token';
let registrationInProgress = false;

export async function registerPushToken(token: string): Promise<void> {
  if (registrationInProgress) return;
  registrationInProgress = true;
  try {
    if (!token) return;

    const user = useSessionStore.getState().user;
    const registrationKey = user?.id ? `${user.id}:${token}` : token;
    const last = await AsyncStorage.getItem(PUSH_LAST_SENT_KEY);
    if (last === registrationKey) return; // already registered for this user

    const headers = {
      'X-User-Id': user?.id ?? '',
      'X-User-Role': user?.role ?? '',
    } as Record<string, string>;

    await apiPost<{ token: string }, void>('/users/me/push-token', { token }, headers);

    await AsyncStorage.setItem(PUSH_LAST_SENT_KEY, registrationKey);
  } catch (error) {
    // fail silently — do not block app usage
    // keep a lightweight debug log
    // eslint-disable-next-line no-console
    console.debug('registerPushToken failed', error);
  } finally {
    registrationInProgress = false;
  }
}
