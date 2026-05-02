import { AppScreenContainer } from '@/components/general/app-screen-container';
import { PrimaryButton } from '@/components/general/primary-button';
import { RoutePassengerSection } from '@/components/route/passenger/route-passenger-section';
import { RouteHeroHeader } from '@/components/route/route-hero-header';
import { RouteStopList } from '@/components/route/route-stop-list';
import { RouteTopBar } from '@/components/route/route-top-bar';
import { useIsRouteDay } from '@/hooks/use-is-route-day';
import { useRouteHeroHeader } from '@/hooks/use-route-hero-header';
import { useRoutePassengers } from '@/hooks/use-route-passenger';
import { useRouteStops } from '@/hooks/use-route-stops';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function RouteDetailsScreen() {
  const router = useRouter();

  const { data } = useRouteHeroHeader({ routeId: 'rota-123' });
  const { stops, currentStopId, deleteStop } = useRouteStops({ routeId: 'rota-123' });
  const { passengers } = useRoutePassengers({ routeId: 'rota-123', phase: 'pre_trip' });

  const isRouteDay = useIsRouteDay(data?.recurrence ?? []);

  const confirmedCount = passengers.filter((p) => p.status === 'confirmed').length;
  const totalCount = passengers.length;

  const handleOnBackPress = () => {
    router.push('/driver-home');
  };

  return (
    <AppScreenContainer style={styles.container}>
      <RouteTopBar variant="driver" onBackPress={handleOnBackPress} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {data && (
          <RouteHeroHeader
            routeName={data.routeName}
            recurrence={data.recurrence.join(', ')}
            expectedTime={data.expectedTime}
            durationMinutes={data.durationMinutes}
            distanceKm={data.distanceKm}
            backgroundImage={data.backgroundImage}
          />
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paradas</Text>
          <RouteStopList
            stops={stops}
            currentStopId={currentStopId}
            onDeleteStopPress={deleteStop}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.passengerHeader}>
            <Text style={styles.sectionTitle}>Passageiros →</Text>
            <Text style={styles.passengerCount}>
              {confirmedCount}/{totalCount} Confirmados
            </Text>
          </View>
          <RoutePassengerSection passengers={passengers} phase="pre_trip" />
        </View>
      </ScrollView>

      {isRouteDay && (
        <PrimaryButton
          icon="check"
          labelColor="colors.white"
          label="Iniciar rota"
          onPress={() => {}}
          style={styles.startButton}
        />
      )}
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  section: {
    paddingHorizontal: 0,
    paddingTop: 24,
    gap: 12,
  },
  sectionTitle: {
    ...typography.header3,
    color: colors.dark,
  },
  passengerHeader: {
    gap: 2,
  },
  passengerCount: {
    ...typography.small,
    color: colors.subtleText,
  },
  startButton: {
    alignSelf: 'stretch',
    margin: 16,
  },
});
