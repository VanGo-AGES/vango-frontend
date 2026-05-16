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

export async function getPushNotificationToken(): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  await configureNotificationChannel();

  const permissionStatus = await requestNotificationPermission();

  if (permissionStatus !== 'granted') {
    return null;
  }

  const devicePushToken = await Notifications.getDevicePushTokenAsync();
  return devicePushToken.data;
}
