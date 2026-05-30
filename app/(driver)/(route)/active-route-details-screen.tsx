import { EmptyState } from '@/components/general/empty-state';
import { PrimaryButton } from '@/components/general/primary-button';
import { RoutePassengerSection } from '@/components/route/passenger/route-passenger-section';
import { RouteHeroHeader } from '@/components/route/route-hero-header';
import { RouteStopList, type Stop } from '@/components/route/route-stop-list';
import { RouteTopBar } from '@/components/route/route-top-bar';
import { useRouteDetail } from '@/hooks/use-route-detail';
import { useTrip } from '@/hooks/use-trip';
import { useTripNextStop } from '@/hooks/use-trip-next-stop';
import { ApiError } from '@/services/api';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import type { AddressResponse, StopResponse } from '@/types/route.types';
import type { TripPassangerResponse } from '@/types/trip.types';
import type {
  PassengerStatus,
  RoutePassengerCardProps,
} from '@/components/route/passenger/route-passenger-card';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

const FALLBACK_DURATION_MINUTES = 30;
const FALLBACK_DISTANCE_KM = 10;

type TripDirection = 'ida' | 'volta';

type CardPassanger = Omit<RoutePassengerCardProps, 'phase'>;

function formatRecurrenceLabel(recurrence: string): string {
  return recurrence
    .split(',')
    .map((day) => day.trim())
    .filter(Boolean)
    .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
    .join(' • ');
}

function formatExpectedTime(value: string): string {
  return value.length >= 5 ? value.slice(0, 5) : value;
}

function formatAddress(address: AddressResponse): string {
  return [address.street, address.number].filter(Boolean).join(', ');
}

function buildUiStops(
  origin: AddressResponse,
  destination: AddressResponse,
  stops: StopResponse[],
  passangerByRpId: Map<string, TripPassangerResponse>,
  currentStopRpId?: string,
): (Stop & { isCurrent?: boolean })[] {
  const sortedStops = [...stops].sort((a, b) => a.order_index - b.order_index);

  return [
    {
      id: `origin-${origin.id}`,
      type: 'origin',
      address: formatAddress(origin),
    },
    ...sortedStops.map<Stop & { isCurrent?: boolean }>((stop) => {
      const passanger = passangerByRpId.get(stop.route_passanger_id);
      return {
        id: stop.route_passanger_id,
        type: 'stop',
        passengerName: passanger?.passanger_name,
        address: formatAddress(stop.address),
        isCurrent: stop.route_passanger_id === currentStopRpId,
      };
    }),
    {
      id: `destination-${destination.id}`,
      type: 'destination',
      address: formatAddress(destination),
    },
  ];
}

/**
 * Mapeia o vínculo passageiro×trip para o card visual.
 * - `presente`  → embarcou (ida) ; quem desembarcou (alighted) → entregue (volta)
 * - `pendente` da próxima parada → próximo
 * - demais `pendente` → pendente
 * - `ausente` → reusa `pending` com o texto "Ausente"
 */
function mapTripPassangerToCard(
  passanger: TripPassangerResponse,
  direction: TripDirection,
  nextTripPassangerId?: string,
): CardPassanger {
  const base = {
    name: passanger.passanger_name,
    avatarUrl: passanger.photo_url ?? undefined,
  };

  if (passanger.status === 'ausente') {
    return { ...base, status: 'pending', statusLabel: 'Ausente' };
  }

  const isNext = !!nextTripPassangerId && passanger.id === nextTripPassangerId;

  if (direction === 'volta') {
    if (passanger.alighted_at != null) {
      return { ...base, status: 'delivered' };
    }
    return { ...base, status: isNext ? 'next' : 'pending' };
  }

  if (passanger.status === 'presente') {
    return { ...base, status: 'boarded' };
  }
  return { ...base, status: isNext ? 'next' : 'pending' };
}

export default function DriverActiveRouteDetailsScreen() {
  const router = useRouter();
  const { routeId, tripId } = useLocalSearchParams<{ routeId: string; tripId: string }>();
  const { height: screenHeight } = useWindowDimensions();
  const heroHeight = Math.max(320, Math.min(420, Math.round(screenHeight * 0.42)));

  const {
    data: route,
    isLoading: isRouteLoading,
    isError: isRouteError,
    refetch: refetchRoute,
  } = useRouteDetail(routeId);

  const {
    data: trip,
    isLoading: isTripLoading,
    isError: isTripError,
    error: tripError,
    refetch: refetchTrip,
  } = useTrip(tripId);

  const { data: nextStop } = useTripNextStop(tripId);

  // 404 em getTrip → a viagem não existe mais; volta pra home.
  const tripNotFound = tripError instanceof ApiError && tripError.status === 404;

  useEffect(() => {
    if (tripNotFound) {
      router.replace('/driver-home' as never);
    }
  }, [tripNotFound, router]);

  const isLoading = isRouteLoading || isTripLoading;

  const tripDirection: TripDirection = route?.route_type === 'inbound' ? 'volta' : 'ida';

  const tripPassangers = useMemo(() => trip?.trip_passangers ?? [], [trip]);

  const passangerByRpId = useMemo(() => {
    const map = new Map<string, TripPassangerResponse>();
    tripPassangers.forEach((p) => map.set(p.route_passanger_id, p));
    return map;
  }, [tripPassangers]);

  // A próxima parada pendente destaca-se na lista. nextStop entrega o
  // trip_passanger_id; resolvemos o route_passanger_id correspondente para
  // casar com a chave usada na lista de paradas.
  const nextTripPassangerId = nextStop?.trip_passanger_id;
  const currentStopRpId = useMemo(() => {
    if (!nextTripPassangerId) {
      return undefined;
    }
    return tripPassangers.find((p) => p.id === nextTripPassangerId)?.route_passanger_id;
  }, [tripPassangers, nextTripPassangerId]);

  const stopsForView = useMemo(() => {
    if (!route) {
      return [];
    }
    return buildUiStops(
      route.origin_address,
      route.destination_address,
      route.stops,
      passangerByRpId,
      currentStopRpId,
    );
  }, [route, passangerByRpId, currentStopRpId]);

  const cardPassangers = useMemo(
    () => tripPassangers.map((p) => mapTripPassangerToCard(p, tripDirection, nextTripPassangerId)),
    [tripPassangers, tripDirection, nextTripPassangerId],
  );

  const totalPassangersCount = tripPassangers.length;
  const completedCount = useMemo(() => {
    if (tripDirection === 'volta') {
      return tripPassangers.filter((p) => p.alighted_at != null).length;
    }
    return tripPassangers.filter((p) => p.status === 'presente').length;
  }, [tripPassangers, tripDirection]);

  const handleOnBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/driver-home' as never);
    }
  };

  const handleNavigationCTA = () => {
    router.push({
      pathname: '/driver-active-route' as never,
      params: { tripId },
    });
  };

  if (isLoading || tripNotFound) {
    return (
      <View style={styles.screen}>
        <View style={styles.topBarContainer}>
          <RouteTopBar
            variant="driver"
            onBackPress={handleOnBackPress}
            backgroundColor="transparent"
            showMenu={false}
            style={styles.topBarOverlay}
          />
        </View>
        <View style={styles.feedbackWrapper}>
          <EmptyState icon="schedule" text="Carregando os detalhes da viagem..." />
        </View>
      </View>
    );
  }

  if (isRouteError || isTripError || !route || !trip) {
    return (
      <View style={styles.screen}>
        <View style={styles.topBarContainer}>
          <RouteTopBar
            variant="driver"
            onBackPress={handleOnBackPress}
            backgroundColor="transparent"
            showMenu={false}
            style={styles.topBarOverlay}
          />
        </View>
        <View style={styles.feedbackWrapper}>
          <EmptyState
            icon="error-outline"
            text="Não foi possível carregar a viagem. Toque para tentar novamente."
          />
          <TouchableOpacity
            onPress={() => {
              refetchRoute();
              refetchTrip();
            }}
            accessibilityRole="button"
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topBarContainer}>
        <RouteTopBar
          variant="driver"
          onBackPress={handleOnBackPress}
          showMenu={false}
          backgroundColor="transparent"
          style={styles.topBarOverlay}
        />
      </View>

      <View style={styles.heroSection}>
        <RouteHeroHeader
          routeName={route.name}
          recurrence={formatRecurrenceLabel(route.recurrence)}
          expectedTime={formatExpectedTime(route.expected_time)}
          durationMinutes={route.estimated_duration_min ?? FALLBACK_DURATION_MINUTES}
          distanceKm={route.total_distance_km ?? FALLBACK_DISTANCE_KM}
          origin={
            route.origin_address?.latitude != null && route.origin_address?.longitude != null
              ? {
                  latitude: route.origin_address.latitude,
                  longitude: route.origin_address.longitude,
                }
              : undefined
          }
          destination={
            route.destination_address?.latitude != null &&
            route.destination_address?.longitude != null
              ? {
                  latitude: route.destination_address.latitude,
                  longitude: route.destination_address.longitude,
                }
              : undefined
          }
          style={[styles.heroHeader, { minHeight: heroHeight }]}
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainerWithCTA}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stopsSection}>
          <Text style={[styles.sectionTitle, styles.sectionHPadding]}>Paradas</Text>
          <RouteStopList stops={stopsForView} currentStopId={currentStopRpId} />
        </View>

        <View style={styles.passengersBlock}>
          <View style={[styles.passengerHeader, styles.sectionHPadding]}>
            <View style={styles.passengerTitleRow}>
              <Text style={styles.sectionTitle}>Passageiros</Text>
            </View>
            <Text style={styles.passengerCount}>
              {completedCount}/{totalPassangersCount}{' '}
              {tripDirection === 'ida' ? 'Embarcados' : 'Entregues'}
            </Text>
          </View>

          {cardPassangers.length === 0 ? (
            <View style={styles.sectionHPadding}>
              <EmptyState icon="group" text="Nenhum passageiro nesta viagem." />
            </View>
          ) : (
            <RoutePassengerSection
              passengers={cardPassangers}
              phase={tripDirection === 'ida' ? 'pickup' : 'dropoff'}
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.ctaFloating}>
        <PrimaryButton
          label="Navegação"
          onPress={handleNavigationCTA}
          style={styles.ctaButton}
          labelColor={colors.white}
          icon={<MaterialIcons name="arrow-forward" size={20} color={colors.white} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.light,
  },
  topBarContainer: {
    position: 'absolute',
    top: 52,
    left: 4,
    right: 4,
    zIndex: 10,
  },
  topBarOverlay: {
    maxWidth: '100%',
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
  },
  contentContainerWithCTA: {
    paddingBottom: 120,
  },
  heroSection: {
    marginBottom: 16,
  },
  heroHeader: {
    width: '100%',
  },
  stopsSection: {
    paddingTop: 24,
    gap: 12,
  },
  sectionHPadding: {
    paddingHorizontal: 16,
  },
  passengersBlock: {
    paddingTop: 24,
    gap: 12,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.dark,
  },
  passengerHeader: {
    gap: 2,
    marginBottom: 8,
  },
  passengerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passengerCount: {
    ...typography.small,
    color: colors.subtleText,
  },
  ctaFloating: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 44,
    paddingHorizontal: 16,
  },
  ctaButton: {
    alignSelf: 'stretch',
    backgroundColor: colors.dark,
  },
  feedbackWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 16,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
  },
  retryText: {
    ...typography.bodyBold,
    color: colors.dark,
  },
});
