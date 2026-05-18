import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { getPushNotificationToken, registerPushToken } from '@/services/notification.service';
import { useSessionStore } from '@/store/session.store';

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

      // attempt to register immediately if user is authenticated
      const user = useSessionStore.getState().user;
      if (user) {
        // fire-and-forget; errors handled silently
        void registerPushToken(token);
      }

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

  // when user becomes available after login/hydration, register token if we have it
  useEffect(() => {
    const unsub = useSessionStore.subscribe((state) => {
      const user = state.user;
      if (user && pushNotificationToken) {
        void registerPushToken(pushNotificationToken);
      }
    });

    return () => unsub();
  }, [pushNotificationToken]);

  return {
    pushNotificationToken,
    permissionDenied,
  };
}
