import { useCallback, useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { useRootNavigationState, useRouter } from 'expo-router';
import { navigateFromNotification } from '@/lib/notification-navigation';
import { getPushNotificationToken, registerPushToken } from '@/services/notification.service';
import { useSessionStore } from '@/store/session.store';

export function usePushNotifications() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const userRole = useSessionStore((state) => state.user?.role);
  const hasHydrated = useSessionStore((state) => state.hasHydrated);
  const [pushNotificationToken, setPushNotificationToken] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const foregroundNotificationListener = useRef<Notifications.EventSubscription | null>(null);
  const notificationResponseListener = useRef<Notifications.EventSubscription | null>(null);
  const pendingNotificationRef = useRef<
    Notifications.Notification | Notifications.NotificationResponse | null
  >(null);
  const didCheckInitialNotification = useRef(false);

  const canNavigate = Boolean(rootNavigationState?.key && hasHydrated);

  const handleNotificationNavigation = useCallback(
    (input: Notifications.Notification | Notifications.NotificationResponse) => {
      if (!canNavigate) {
        pendingNotificationRef.current = input;
        return;
      }

      navigateFromNotification({
        input,
        router,
        userRole: useSessionStore.getState().user?.role ?? userRole,
      });
    },
    [canNavigate, router, userRole],
  );

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
        (_notification) => {
          // banner is shown automatically via setNotificationHandler; navigation only on tap
        },
      );

      notificationResponseListener.current = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          handleNotificationNavigation(response);
        },
      );
    }

    registerPushNotifications();

    return () => {
      foregroundNotificationListener.current?.remove();
      notificationResponseListener.current?.remove();
    };
  }, [handleNotificationNavigation]);

  useEffect(() => {
    if (didCheckInitialNotification.current) {
      return;
    }

    didCheckInitialNotification.current = true;

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        handleNotificationNavigation(response);
        Notifications.clearLastNotificationResponse();
      }
    });
  }, [handleNotificationNavigation]);

  useEffect(() => {
    if (!canNavigate || !pendingNotificationRef.current) {
      return;
    }

    const notification = pendingNotificationRef.current;
    pendingNotificationRef.current = null;
    handleNotificationNavigation(notification);
  }, [canNavigate, handleNotificationNavigation]);

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
