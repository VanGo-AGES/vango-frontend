import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { getNotificationDestination } from '@/lib/notification-navigation';
import { getPushNotificationToken } from '@/services/notification.service';
import type { NotificationPayload } from '@/types/notification.types';
import { useSessionStore } from '@/store/session.store';

export function usePushNotifications() {
  const router = useRouter();
  const userRole = useSessionStore((state) => state.user?.role);
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
        (response) => {
          const payload = response.notification.request.content.data as NotificationPayload;
          const destination = getNotificationDestination(payload);

          if (destination) {
            router.push({
              pathname: destination.path as never,
              params: destination.params,
            });
          } else {
            const fallback =
              userRole == 'driver'
                ? '/(driver)/driver-home-screen'
                : '/(passenger)/passenger-home-screen';
            router.push({ pathname: fallback as never });
          }
        },
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
