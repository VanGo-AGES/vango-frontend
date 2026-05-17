import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

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
