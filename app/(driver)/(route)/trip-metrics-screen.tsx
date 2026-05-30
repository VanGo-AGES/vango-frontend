import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { MetricDateChip } from '@/components/metrics/metric-date-chip';
import { MetricList } from '@/components/metrics/metric-list';
import { PrimaryButton } from '@/components/general/primary-button';
import { RouteHeroHeader } from '@/components/route/route-hero-header';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { MaterialIcons } from '@expo/vector-icons';

const FALLBACK_ROUTE_NAME = 'Rota finalizada';
const FALLBACK_RECURRENCE = 'Seg • Ter • Qua • Qui • Sex';
const FALLBACK_EXPECTED_TIME = '07:00';
const FALLBACK_DURATION_MINUTES = 45;
const FALLBACK_DISTANCE_KM = 12;
const FALLBACK_PASSENGERS = 3;

//TO DO
const MOCK_ORIGIN = { latitude: -30.0277, longitude: -51.1632 };
const MOCK_DESTINATION = { latitude: -30.0495, longitude: -51.2287 };

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
  routeName?: string;
  recurrence?: string;
  expectedTime?: string;
  durationMinutes?: string;
  distanceKm?: string;
  passengersCount?: string;
  tripDate?: string;
};

export default function TripMetricsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<TripMetricsParams>();
  const { height: screenHeight } = useWindowDimensions();
  const heroHeight = Math.max(220, Math.min(300, Math.round(screenHeight * 0.3)));

  const routeName = params.routeName ?? FALLBACK_ROUTE_NAME;
  const recurrence = params.recurrence
    ? formatRecurrenceLabel(params.recurrence)
    : FALLBACK_RECURRENCE;
  const expectedTime = params.expectedTime
    ? formatExpectedTime(params.expectedTime)
    : FALLBACK_EXPECTED_TIME;
  const durationMinutes = params.durationMinutes
    ? Number(params.durationMinutes)
    : FALLBACK_DURATION_MINUTES;
  const distanceKm = params.distanceKm ? Number(params.distanceKm) : FALLBACK_DISTANCE_KM;
  const passengersCount = params.passengersCount
    ? Number(params.passengersCount)
    : FALLBACK_PASSENGERS;

  const tripDate = params.tripDate ? new Date(params.tripDate) : new Date();
  const dateLabel = formatTripDate(tripDate);
  const timeLabel = formatTripTime(tripDate, durationMinutes);

  const handleExit = () => {
    router.replace('/driver-home');
  };

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
            //TO DO
            origin={MOCK_ORIGIN}
            destination={MOCK_DESTINATION}
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
});
