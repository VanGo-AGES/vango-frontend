import { NotificationPayload, NotificationType } from '@/types/notification.types';

export type NotificationDestination = {
  path: string;
  params?: Record<string, string>;
};

export function getNotificationDestination(
  payload: NotificationPayload,
): NotificationDestination | null {
  const { type, routeId } = payload;
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
      return null;
  }
}
