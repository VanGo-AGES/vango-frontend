export type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined';

export type PushNotificationTokenResult =
  | { token: string; reason: 'success' }
  | { token: null; reason: 'not-a-device' | 'permission-denied' | 'token-unavailable' };

export async function configureNotificationChannel(): Promise<void> {}

export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  return 'denied';
}

export async function getPushNotificationToken(): Promise<PushNotificationTokenResult> {
  return { token: null, reason: 'not-a-device' };
}

export async function registerPushToken(): Promise<void> {}
