import { Alert, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { EmptyState } from '@/components/general/empty-state';
import { PrimaryButton } from '@/components/general/primary-button';
import { RouteHeroHeader } from '@/components/route/route-hero-header';
import { RouteStopList, type Stop } from '@/components/route/route-stop-list';
import { RouteTopBar } from '@/components/route/route-top-bar';
import { useCurrentTrip } from '@/hooks/use-current-trip';
import { usePassangerRouteDetail } from '@/hooks/use-passanger-route-detail';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import type { AddressResponse, RouteStopResponse } from '@/types/route.types';
import { useSessionStore } from '@/store/session.store';

const FALLBACK_DURATION_MINUTES = 30;
const FALLBACK_DISTANCE_KM = 10;

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

function normalizeParam(value?: string | string[]): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function normalizeRecurrence(recurrence: string | string[]): string {
  return Array.isArray(recurrence) ? recurrence.join(',') : recurrence;
}

function formatAddress(address: AddressResponse): string {
  return [address.street, address.number].filter(Boolean).join(', ');
}

function buildUiStops(
  origin: AddressResponse,
  destination: AddressResponse,
  stops: RouteStopResponse[],
  currentStopId?: string | null,
): (Stop & { isCurrent?: boolean })[] {
  const sortedStops = [...stops].sort((a, b) => a.order_index - b.order_index);

  return [
    {
      id: `origin-${origin.id}`,
      type: 'origin',
      address: formatAddress(origin),
    },
    ...sortedStops.map<Stop & { isCurrent?: boolean }>((stop) => ({
      id: stop.route_passanger_id,
      type: 'stop',
      address: [stop.address.label, stop.address.street, stop.address.number]
        .filter(Boolean)
        .join(' - '),
      isCurrent: stop.route_passanger_id === currentStopId,
    })),
    {
      id: `destination-${destination.id}`,
      type: 'destination',
      address: formatAddress(destination),
    },
  ];
}

export default function PassengerActiveRouteDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    routeId?: string | string[];
    dependentId?: string | string[];
  }>();

  const routeId = normalizeParam(params.routeId);
  const dependentId = normalizeParam(params.dependentId);
  const sessionUser = useSessionStore((state) => state.user);

  const { height: screenHeight } = useWindowDimensions();
  const heroHeight = Math.max(320, Math.min(420, Math.round(screenHeight * 0.42)));

  const {
    route,
    isLoading: isRouteLoading,
    isError: isRouteError,
    error: routeError,
  } = usePassangerRouteDetail({
    routeId,
    dependentId,
  });

  const { data: currentTrip, isLoading: isCurrentTripLoading } = useCurrentTrip(
    routeId,
    dependentId,
  );

  const isLoading = isRouteLoading || isCurrentTripLoading;

  const handleOnBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/passenger-home-screen' as never);
    }
  };

  const handleAccompanyTrip = () => {
    if (!routeId || !currentTrip?.trip_id) {
      Alert.alert('Viagem ainda não iniciada', 'Aguarde o motorista iniciar a viagem.');
      return;
    }

    router.push({
      pathname: '/(passenger)/passenger-active-route-screen' as never,
      params: {
        routeId,
        ...(dependentId ? { dependentId } : {}),
      },
    });
  };

  const currentStopId = route?.current_trip_id ?? currentTrip?.trip_id ?? null;

  const stopsForView = route
    ? buildUiStops(route.origin_address, route.destination_address, route.stops, currentStopId)
    : [];

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <View style={styles.topBarContainer}>
          <RouteTopBar
            variant="passenger"
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

  if (!isLoading && (isRouteError || !route)) {
    return (
      <View style={styles.screen}>
        <View style={styles.topBarContainer}>
          <RouteTopBar
            variant="passenger"
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
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topBarContainer}>
        <RouteTopBar
          variant="passenger"
          onBackPress={handleOnBackPress}
          showMenu={false}
          backgroundColor="transparent"
          style={styles.topBarOverlay}
        />
      </View>

      <View style={styles.heroSection}>
        <RouteHeroHeader
          routeName={route.name}
          recurrence={formatRecurrenceLabel(normalizeRecurrence(route.recurrence))}
          expectedTime={formatExpectedTime(route.expected_time)}
          durationMinutes={FALLBACK_DURATION_MINUTES}
          distanceKm={FALLBACK_DISTANCE_KM}
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

          <RouteStopList stops={stopsForView} currentStopId={currentStopId ?? undefined} />
        </View>
      </ScrollView>

      <View style={styles.ctaFloating}>
        <PrimaryButton
          label="Acompanhar Viagem"
          onPress={handleAccompanyTrip}
          style={styles.ctaButton}
          labelColor={colors.white}
          icon={<MaterialIcons name="arrow-forward" size={16} color={colors.white} />}
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
    paddingBottom: 140,
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
  sectionTitle: {
    ...typography.subtitle,
    color: colors.dark,
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
});
