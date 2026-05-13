import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { PrimaryButton } from '@/components/general/primary-button';
import { RoutePassengerCard } from '@/components/route/passenger/route-passenger-card';
import { RouteHeroHeader } from '@/components/route/route-hero-header';
import { RouteStopList } from '@/components/route/route-stop-list';
import { RouteTopBar } from '@/components/route/route-top-bar';
import { useRouteHeroHeader } from '@/hooks/use-route-hero-header';
import { useRoutePassengers } from '@/hooks/use-route-passenger';
import { useRouteStops } from '@/hooks/use-route-stops';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

const ROUTE_ID = 'rota-123';

export default function DriverActiveRouteScreen() {
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();
  const heroHeight = Math.max(320, Math.min(420, Math.round(screenHeight * 0.42)));

  const { data } = useRouteHeroHeader({ routeId: ROUTE_ID });
  const { stops, currentStopId } = useRouteStops({ routeId: ROUTE_ID });
  const { passengers } = useRoutePassengers({ routeId: ROUTE_ID, phase: 'pickup' });

  const deliveredCount = passengers.filter((p) => p.status === 'boarded').length;
  const totalCount = passengers.length;

  return (
    <View style={styles.screen}>
      <View style={styles.topBarContainer}>
        <RouteTopBar onBackPress={() => router.push('/driver-home')} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {data && (
          <View style={styles.heroSection}>
            <RouteHeroHeader
              routeName={data.routeName}
              recurrence={data.recurrence.join(', ')}
              expectedTime={data.expectedTime}
              durationMinutes={data.durationMinutes}
              distanceKm={data.distanceKm}
              style={[styles.heroHeader, { minHeight: heroHeight }]}
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paradas</Text>
          <RouteStopList stops={stops} currentStopId={currentStopId} />
        </View>

        <View style={styles.navButtonSection}>
          <PrimaryButton
            label="Navegação"
            onPress={() => router.push('/')}
            style={styles.navButton}
            labelColor={colors.white}
            icon={<MaterialIcons name="arrow-forward" size={20} color={colors.white} />}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.passengerHeader}>
            <Text style={styles.sectionTitle}>Passageiros</Text>
            <Text style={styles.passengerCount}>
              {deliveredCount}/{totalCount} Embarcados
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.passengerList}
          >
            {passengers.map((passenger, index) => (
              <RoutePassengerCard
                key={`${passenger.name}-${index}`}
                name={passenger.name}
                avatarUrl={passenger.avatarUrl}
                status={passenger.status}
                phase="pickup"
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
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
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 48,
  },
  heroSection: {
    marginBottom: 16,
  },
  heroHeader: {
    width: '100%',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 12,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.dark,
  },
  navButtonSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  navButton: {
    alignSelf: 'stretch',
  },
  passengerHeader: {
    gap: 2,
  },
  passengerCount: {
    ...typography.small,
    color: colors.subtleText,
  },
  passengerList: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
});
