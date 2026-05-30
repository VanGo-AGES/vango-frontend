import type { Router } from 'expo-router';
import { NotificationType } from '@/types/notification.types';
import type { UserRole } from '@/types/user.types';

export type NotificationDestination = {
  path: string;
  params?: Record<string, string>;
};

type NotificationData = Record<string, unknown>;

type NotificationNavigationInput =
  | NotificationData
  | {
      data?: NotificationData;
      notification?: {
        request?: {
          content?: {
            data?: NotificationData;
          };
        };
      };
      request?: {
        content?: {
          data?: NotificationData;
        };
      };
    };

type NotificationNavigationParams = {
  input: NotificationNavigationInput | null | undefined;
  router: Router;
  userRole?: UserRole | null;
};

const ROUTE_REQUIRED_NOTIFICATION_TYPES = new Set<NotificationType>([
  NotificationType.DRIVER_PASSENGER_REQUESTED,
  NotificationType.DRIVER_PASSENGER_LEFT,
  NotificationType.DRIVER_PASSENGER_ABSENT,
  NotificationType.TRIP_STARTED,
  NotificationType.TRIP_ARRIVING,
  NotificationType.TRIP_ARRIVED,
]);

function isRecord(value: unknown): value is NotificationData {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getStringField(data: NotificationData, field: string): string | undefined {
  const value = data[field];

  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function isNotificationType(value: string | undefined): value is NotificationType {
  return Object.values(NotificationType).includes(value as NotificationType);
}

export function getHomeDestination(userRole?: UserRole | null): NotificationDestination {
  return {
    path: userRole === 'driver' ? '/(driver)/driver-home' : '/(passenger)/passenger-home-screen',
  };
}

export function getNotificationData(
  input: NotificationNavigationInput | null | undefined,
): NotificationData | null {
  if (!isRecord(input)) {
    return null;
  }

  if (isRecord(input.data)) {
    return input.data;
  }

  const notification = input.notification;
  if (isRecord(notification)) {
    const request = notification.request;
    const content = isRecord(request) ? request.content : null;
    const data = isRecord(content) ? content.data : null;

    if (isRecord(data)) {
      return data;
    }
  }

  const request = input.request;
  const content = isRecord(request) ? request.content : null;
  const data = isRecord(content) ? content.data : null;
  if (isRecord(data)) {
    return data;
  }

  return input;
}

export function getNotificationDestination(
  data: NotificationNavigationInput | null | undefined,
  userRole?: UserRole | null,
): NotificationDestination {
  const payload = getNotificationData(data);

  if (!payload) {
    return getHomeDestination(userRole);
  }

  const type = getStringField(payload, 'type');
  const routeId = getStringField(payload, 'routeId');

  if (!isNotificationType(type)) {
    return getHomeDestination(userRole);
  }

  if (ROUTE_REQUIRED_NOTIFICATION_TYPES.has(type) && !routeId) {
    return getHomeDestination(userRole);
  }

  const routeParams = routeId ? { routeId } : undefined;

  switch (type) {
    case NotificationType.DRIVER_PASSENGER_REQUESTED:
      return {
        path: '/(driver)/(route)/route-passengers-screen',
        params: routeParams,
      };

    case NotificationType.DRIVER_PASSENGER_LEFT:
    case NotificationType.DRIVER_PASSENGER_ABSENT:
      return {
        path: '/(driver)/(route)/route-details-screen',
        params: routeParams,
      };

    case NotificationType.PASSENGER_ACCEPTED:
    case NotificationType.PASSENGER_REJECTED:
    case NotificationType.PASSENGER_REMOVED:
    case NotificationType.ROUTE_CANCELLED:
      return {
        path: '/(passenger)/passenger-home-screen',
      };

    case NotificationType.TRIP_STARTED:
    case NotificationType.TRIP_ARRIVING:
    case NotificationType.TRIP_ARRIVED:
      return {
        path: '/(passenger)/passenger-active-route-screen',
        params: routeParams,
      };

    default:
      return getHomeDestination(userRole);
  }
}

export function navigateFromNotification({
  input,
  router,
  userRole,
}: NotificationNavigationParams) {
  const destination = getNotificationDestination(input, userRole);

  router.push({
    pathname: destination.path as never,
    params: destination.params,
  });
}
