import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { MetricDateChip } from '@/components/metrics/metric-date-chip';
import { MetricList } from '@/components/metrics/metric-list';
import { PrimaryButton } from '@/components/general/primary-button';
import { RouteHeroHeader } from '@/components/route/route-hero-header';
import { useTrip } from '@/hooks/use-trip';
import { useRoute } from '@/hooks/use-route';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { MaterialIcons } from '@expo/vector-icons';

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

function formatTripDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTripTime(start: Date, durationMinutes: number): string {
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  const fmt = (d: Date) => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${fmt(start)} - ${fmt(end)}`;
}

type TripMetricsParams = {
  tripId?: string;
};

export default function TripMetricsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<TripMetricsParams>();
  const { height: screenHeight } = useWindowDimensions();
  const heroHeight = Math.max(220, Math.min(300, Math.round(screenHeight * 0.3)));

  const tripId = Array.isArray(params.tripId) ? params.tripId[0] : params.tripId;

  const { data: trip, isLoading: isTripLoading, isError: isTripError } = useTrip(tripId);

  const {
    data: route,
    isLoading: isRouteLoading,
    isError: isRouteError,
  } = useRoute(trip?.route_id);

  const isLoading = isTripLoading || isRouteLoading;
  const hasError = isTripError || isRouteError;

  const routeName = route?.name ?? trip?.route_name ?? '';
  const recurrence = route?.recurrence ? formatRecurrenceLabel(route.recurrence) : '';
  const expectedTime = route?.expected_time ? formatExpectedTime(route.expected_time) : '';

  const startedAt = trip?.started_at ? new Date(trip.started_at) : null;
  const finishedAt = trip?.finished_at ? new Date(trip.finished_at) : null;

  const durationMinutes =
    startedAt && finishedAt ? Math.round((finishedAt.getTime() - startedAt.getTime()) / 60000) : 0;

  const distanceKm = trip?.total_km ?? 0;
  const passengersCount = trip?.trip_passangers?.length ?? 0;

  const tripDate = finishedAt ?? startedAt ?? (trip?.trip_date ? new Date(trip.trip_date) : null);

  const dateLabel = tripDate ? formatTripDate(tripDate) : '';
  const timeLabel = startedAt ? formatTripTime(startedAt, durationMinutes) : '';

  const origin =
    route?.origin_address.latitude != null && route.origin_address.longitude != null
      ? {
          latitude: route.origin_address.latitude,
          longitude: route.origin_address.longitude,
        }
      : undefined;

  const destination =
    route?.destination_address.latitude != null && route.destination_address.longitude != null
      ? {
          latitude: route.destination_address.latitude,
          longitude: route.destination_address.longitude,
        }
      : undefined;

  const handleExit = () => {
    router.replace('/driver-home');
  };

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Carregando métricas da viagem...</Text>
        </View>
      </>
    );
  }

  if (hasError) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Não foi possível carregar as métricas da viagem.</Text>
        </View>
      </>
    );
  }

  if (!trip || !tripDate) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>Métricas da viagem não encontradas.</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.screen}>
        <View style={styles.heroSection}>
          <RouteHeroHeader
            routeName={routeName}
            recurrence={recurrence}
            expectedTime={expectedTime}
            durationMinutes={durationMinutes}
            distanceKm={distanceKm}
            origin={origin}
            destination={destination}
            style={[styles.heroHeader, { minHeight: heroHeight }]}
          />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <Text style={styles.title}>Métricas da viagem</Text>
            <View style={styles.chipsRow}>
              <MetricDateChip label={dateLabel} />
              <MetricDateChip label={timeLabel} />
            </View>
          </View>

          <View style={styles.metricsSection}>
            <MetricList
              metrics={[
                { type: 'distance', value: distanceKm },
                { type: 'duration', value: durationMinutes },
                { type: 'passengers', value: passengersCount },
              ]}
            />
          </View>
        </ScrollView>

        <View style={styles.ctaFloating}>
          <PrimaryButton
            label="Sair"
            onPress={handleExit}
            variant="secondary"
            icon={<MaterialIcons name={'arrow-forward'} color={colors.light} size={24} />}
            style={styles.ctaButton}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.light,
  },
  heroSection: {
    marginBottom: 16,
  },
  heroHeader: {
    width: '100%',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 180,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  title: {
    ...typography.subtitle,
    color: colors.dark,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metricsSection: {
    paddingTop: 24,
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
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.light,
  },
  stateText: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
  },
});
