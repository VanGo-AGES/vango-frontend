import { usePushNotifications } from '@/hooks/use-push-notifications';

export function PushNotificationHandler() {
  usePushNotifications();

  return null;
}
