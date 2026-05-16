import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { getPushNotificationToken } from '@/services/notification.service';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function usePushNotifications() {
  const [pushNotificationToken, setPushNotificationToken] = useState<string | null>(null);

  const [permissionDenied, setPermissionDenied] = useState(false);

  const foregroundNotificationListener = useRef<Notifications.EventSubscription | null>(null);

  const notificationResponseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    async function registerPushNotifications() {
      const token = await getPushNotificationToken();

      if (!token) {
        setPermissionDenied(true);
        return;
      }

      setPushNotificationToken(token);
      setPermissionDenied(false);
    }

    registerPushNotifications();

    foregroundNotificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {},
    );

    notificationResponseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {},
    );

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
