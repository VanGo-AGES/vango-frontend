export enum NotificationType {
  // driver notifications
  DRIVER_PASSENGER_REQUESTED = 'driver_passenger_requested',
  DRIVER_PASSENGER_LEFT = 'driver_passenger_left',
  DRIVER_PASSENGER_ABSENT = 'driver_passenger_absent',

  // passenger notifications
  PASSENGER_ACCEPTED = 'passenger_accepted',
  PASSENGER_REJECTED = 'passenger_rejected',
  PASSENGER_REMOVED = 'passenger_removed',
  PASSENGER_BOARDED = 'passenger_boarded',
  PASSENGER_ABSENT = 'passenger_absent',

  // trip notifications
  ROUTE_CANCELLED = 'route_cancelled',
  TRIP_STARTED = 'trip_started',
  TRIP_ARRIVING = 'trip_arriving',
  TRIP_ARRIVED = 'trip_arrived',
  TRIP_FINISHED = 'trip_finished',
}

export type NotificationPayload = {
  type: NotificationType;
  routeId?: string;
  passengerId?: string;
};
