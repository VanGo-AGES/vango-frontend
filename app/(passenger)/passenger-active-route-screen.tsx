import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActiveRouteMap } from '@/components/route/active-route-map';
import { PassengerTripBottomSheet } from '@/components/route/passenger/passenger-trip-bottom-sheet';
import { RouteTopBar } from '@/components/route/route-top-bar';
import { usePassangerRouteDetail } from '@/hooks/use-passanger-route-detail';
import { colors } from '@/styles/colors';
import type { AddressResponse, PassangerRouteDetailResponse } from '@/types/route.types';

type RoutePoint = {
  latitude: number;
  longitude: number;
};

const FALLBACK_ROUTE: PassangerRouteDetailResponse = {
  route_id: 'fallback-route',
  name: 'Rota em andamento',
  route_type: 'outbound',
  status: 'em_andamento',
  recurrence: ['seg', 'qua', 'sex'],
  expected_time: '07:30',
  origin_address: {
    id: 'origin-fallback',
    label: 'Ponto de partida',
    street: 'Av. Protásio Alves',
    number: '3500',
    neighborhood: 'Petrópolis',
    zip: '90410-000',
    city: 'Porto Alegre',
    state: 'RS',
    latitude: -30.0346,
    longitude: -51.2177,
  },
  destination_address: {
    id: 'destination-fallback',
    label: 'Destino',
    street: 'PUCRS - Av. Ipiranga',
    number: '6681',
    neighborhood: 'Partenon',
    zip: '90619-900',
    city: 'Porto Alegre',
    state: 'RS',
    latitude: -30.0402,
    longitude: -51.2291,
  },
  stops: [
    {
      id: 'stop-fallback',
      route_passanger_id: 'route-passenger-fallback',
      order_index: 1,
      address: {
        label: 'Parada do passageiro',
        street: 'Rua Vicente da Fontoura',
        number: '1280',
      },
    },
  ],
  driver_name: 'Motorista',
  driver_phone: '(51) 99999-9999',
  membership_status: 'accepted',
  my_pickup_address: {
    id: 'pickup-fallback',
    label: 'Parada do passageiro',
    street: 'Rua Vicente da Fontoura',
    number: '1280',
    neighborhood: 'Santana',
    zip: '90640-000',
    city: 'Porto Alegre',
    state: 'RS',
    latitude: -30.0379,
    longitude: -51.2233,
  },
  my_schedules: [],
  current_trip_id: 'trip-fallback',
  dependent_id: null,
  dependent_name: null,
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

  const { route } = usePassangerRouteDetail({ routeId, dependentId });

  const activeRoute = route ?? FALLBACK_ROUTE;

  const mapPoints = useMemo(() => {
    const originPoint = toPoint(activeRoute.origin_address) ??
      toPoint(activeRoute.destination_address) ??
      toPoint(activeRoute.my_pickup_address) ?? {
        latitude: -30.0346,
        longitude: -51.2177,
      };

    const passengerStopPoint = toPoint(activeRoute.my_pickup_address) ??
      toPoint(activeRoute.origin_address) ??
      toPoint(activeRoute.destination_address) ?? {
        latitude: -30.0378,
        longitude: -51.2232,
      };

    const driverProgress = activeRoute.current_trip_id ? 0.42 : 0.28;

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
  }, [activeRoute]);

  const handleBackPress = () => {
    router.back();
  };

  const routeWithOptionalFields = activeRoute as PassangerRouteDetailResponse & {
    driver_plate?: string;
    driver_avatar_url?: string;
    avatar_url?: string;
    driver_photo_url?: string;
  };

  const driverName = activeRoute.driver_name || 'João Silva';
  const driverPlate = routeWithOptionalFields.driver_plate || 'ABC-1234';
  const driverAvatarUrl =
    routeWithOptionalFields.driver_avatar_url ||
    routeWithOptionalFields.avatar_url ||
    routeWithOptionalFields.driver_photo_url ||
    undefined;

  const realAddress =
    activeRoute.my_pickup_address || activeRoute.destination_address || activeRoute.origin_address;
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
          <RouteTopBar
            onBackPress={handleBackPress}
            showMenu={false}
            backgroundColor="transparent"
          />
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
});
