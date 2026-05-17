import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { getPushNotificationToken } from '@/services/notification.service';

export function usePushNotifications() {
  const [pushNotificationToken, setPushNotificationToken] = useState<string | null>(null);

  const [permissionDenied, setPermissionDenied] = useState(false);

  const foregroundNotificationListener = useRef<Notifications.EventSubscription | null>(null);

  const notificationResponseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    async function registerPushNotifications() {
      const { token, reason } = await getPushNotificationToken();
      if (!token) {
        if (reason === 'permission-denied') {
          setPermissionDenied(true);
        }
        return;
      }

      setPushNotificationToken(token);
      setPermissionDenied(false);

      foregroundNotificationListener.current = Notifications.addNotificationReceivedListener(
        () => {},
      );

      notificationResponseListener.current = Notifications.addNotificationResponseReceivedListener(
        () => {},
      );
    }

    registerPushNotifications();

    return () => {
      foregroundNotificationListener.current?.remove();
      notificationResponseListener.current?.remove();
    };
  }, []);

  return {
    pushNotificationToken,
    permissionDenied,
  };
}
