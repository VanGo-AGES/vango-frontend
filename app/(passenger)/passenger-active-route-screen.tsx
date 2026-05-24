import { useEffect, useMemo } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/general/empty-state';
import { ActiveRouteMap } from '@/components/route/active-route-map';
import { PassengerTripBottomSheet } from '@/components/route/passenger/passenger-trip-bottom-sheet';
import { RouteTopBar } from '@/components/route/route-top-bar';
import { useCurrentTrip } from '@/hooks/use-current-trip';
import { usePassangerRouteDetail } from '@/hooks/use-passanger-route-detail';
import { colors } from '@/styles/colors';
import type { AddressResponse, PassangerRouteDetailResponse } from '@/types/route.types';
import type { CurrentTripResponse } from '@/types/trip.types';

type RoutePoint = {
  latitude: number;
  longitude: number;
};

function normalizeParam(value?: string | string[]): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function hasCoordinates(
  address?: Partial<AddressResponse> | null,
): address is AddressResponse & { latitude: number; longitude: number } {
  return (
    !!address &&
    typeof address.latitude === 'number' &&
    address.latitude !== null &&
    typeof address.longitude === 'number' &&
    address.longitude !== null
  );
}

function toPoint(address?: Partial<AddressResponse> | null): RoutePoint | null {
  if (!hasCoordinates(address)) {
    return null;
  }

  return {
    latitude: address.latitude,
    longitude: address.longitude,
  };
}

function interpolatePoint(start: RoutePoint, end: RoutePoint, progress: number): RoutePoint {
  const clampedProgress = Math.max(0, Math.min(1, progress));

  return {
    latitude: start.latitude + (end.latitude - start.latitude) * clampedProgress,
    longitude: start.longitude + (end.longitude - start.longitude) * clampedProgress,
  };
}

function calculateDistanceKm(start: RoutePoint, end: RoutePoint): number {
  const earthRadiusKm = 6371;
  const latitudeDelta = ((end.latitude - start.latitude) * Math.PI) / 180;
  const longitudeDelta = ((end.longitude - start.longitude) * Math.PI) / 180;
  const startLatitude = (start.latitude * Math.PI) / 180;
  const endLatitude = (end.latitude * Math.PI) / 180;

  const a =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.sin(longitudeDelta / 2) *
      Math.sin(longitudeDelta / 2) *
      Math.cos(startLatitude) *
      Math.cos(endLatitude);

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatArrivalTime(minutesFromNow: number): string {
  const arrival = new Date(Date.now() + Math.max(1, minutesFromNow) * 60_000);
  return `${String(arrival.getHours()).padStart(2, '0')}h${String(arrival.getMinutes()).padStart(
    2,
    '0',
  )}`;
}

function formatDistance(distanceKm: number): string {
  return `${distanceKm < 10 ? distanceKm.toFixed(1) : Math.round(distanceKm)} km`.replace('.', ',');
}

export default function PassengerActiveRouteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    routeId?: string | string[];
    dependentId?: string | string[];
  }>();

  const routeId = normalizeParam(params.routeId);
  const dependentId = normalizeParam(params.dependentId);

  const {
    route,
    isLoading: isRouteLoading,
    isError: isRouteError,
  } = usePassangerRouteDetail({
    routeId,
    dependentId,
  });

  const {
    data: currentTrip,
    isLoading: isCurrentTripLoading,
    isError: isCurrentTripError,
  } = useCurrentTrip(routeId, dependentId);

  const handleBackPress = () => {
    router.back();
  };

  if (isRouteLoading || isCurrentTripLoading) {
    return (
      <FeedbackScreen
        topInset={insets.top}
        onBackPress={handleBackPress}
        icon="schedule"
        text="Carregando o acompanhamento da viagem..."
      />
    );
  }

  if (isRouteError || isCurrentTripError || !route || !currentTrip) {
    return (
      <FeedbackScreen
        topInset={insets.top}
        onBackPress={handleBackPress}
        icon="error-outline"
        text="Não foi possível carregar a viagem. Toque para tentar novamente."
      />
    );
  }

  return (
    <ActiveRouteContent
      route={route}
      currentTrip={currentTrip}
      insets={insets}
      onBackPress={handleBackPress}
    />
  );
}

type FeedbackScreenProps = {
  topInset: number;
  onBackPress: () => void;
  icon: 'schedule' | 'error-outline';
  text: string;
};

function FeedbackScreen({ topInset, onBackPress, icon, text }: FeedbackScreenProps) {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.screen}>
        <View style={[styles.topBarContainer, { top: topInset + 8 }]}>
          <RouteTopBar onBackPress={onBackPress} showMenu={false} backgroundColor="transparent" />
        </View>
        <View style={styles.feedbackWrapper}>
          <EmptyState icon={icon} text={text} />
        </View>
      </View>
    </>
  );
}

type ActiveRouteContentProps = {
  route: PassangerRouteDetailResponse;
  currentTrip: CurrentTripResponse;
  insets: { top: number };
  onBackPress: () => void;
};

export function ActiveRouteContent({
  route,
  currentTrip,
  insets,
  onBackPress,
}: ActiveRouteContentProps) {
  const mapPoints = useMemo(() => {
    const originPoint = toPoint(route.origin_address) ??
      toPoint(route.destination_address) ??
      toPoint(route.my_pickup_address) ?? {
        latitude: -30.0346,
        longitude: -51.2177,
      };

    const passengerStopPoint = toPoint(route.my_pickup_address) ??
      toPoint(route.origin_address) ??
      toPoint(route.destination_address) ?? {
        latitude: -30.0378,
        longitude: -51.2232,
      };

    // TODO(US11-integração): substituir geometria mockada por posição real
    // do motorista vinda do Socket.IO (location_update).
    const driverProgress = route.current_trip_id ? 0.42 : 0.28;

    const driverPoint = interpolatePoint(originPoint, passengerStopPoint, driverProgress);
    const distanceKm = Math.max(calculateDistanceKm(driverPoint, passengerStopPoint), 0.3);
    const timeRemaining = Math.max(2, Math.round(distanceKm * 4));

    return {
      driverPoint,
      passengerStopPoint,
      distanceKm,
      timeRemaining,
      estimatedArrival: formatArrivalTime(timeRemaining),
    };
  }, [route]);

  const driverName = currentTrip.driver_name;
  const driverPlate = currentTrip.vehicle_plate ?? '';
  const driverAvatarUrl = currentTrip.driver_photo_url ?? undefined;

  const realAddress = route.my_pickup_address || route.destination_address || route.origin_address;
  const deliveryAddress = realAddress
    ? [realAddress.street, realAddress.number].filter(Boolean).join(', ')
    : 'Av. Bento Gonçalves, 500';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.screen}>
        <ActiveRouteMap
          currentLocation={mapPoints.driverPoint}
          nextStopLocation={mapPoints.passengerStopPoint}
          containerStyle={styles.map}
          recenterButtonStyle={styles.recenterButton}
        />

        <View style={[styles.topBarContainer, { top: insets.top + 8 }]}>
          <RouteTopBar onBackPress={onBackPress} showMenu={false} backgroundColor="transparent" />
        </View>

        <PassengerTripBottomSheet
          state="driver_on_the_way"
          driver={{
            id: 'driver-active-route',
            name: driverName,
            avatarUrl: driverAvatarUrl,
            plate: driverPlate,
          }}
          timeRemaining={mapPoints.timeRemaining}
          estimatedArrival={mapPoints.estimatedArrival}
          distance={formatDistance(mapPoints.distanceKm)}
          countdownSeconds={mapPoints.timeRemaining * 60}
          address={deliveryAddress}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.light,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    borderWidth: 0,
    borderRadius: 0,
    overflow: 'visible',
    backgroundColor: colors.light,
  },
  topBarContainer: {
    position: 'absolute',
    left: 4,
    right: 4,
    zIndex: 30,
  },
  recenterButton: {
    marginBottom: 336,
  },
  feedbackWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 16,
  },
});
