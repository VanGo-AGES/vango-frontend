import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import { RoutePassengerCard } from '@/components/route/passenger/route-passenger-card';
import { NavigationFab } from '@/components/route/navigation-fab';
import { RouteHeroHeader } from '@/components/route/route-hero-header';
import { RouteStopList } from '@/components/route/route-stop-list';
import { RouteTopBar } from '@/components/route/route-top-bar';
import { useRouteHeroHeader } from '@/hooks/use-route-hero-header';
import { useRoutePassengers } from '@/hooks/use-route-passenger';
import { useRouteStops } from '@/hooks/use-route-stops';
import { openWazeNavigation, getWazeUrls } from '@/lib/waze-navigation';
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
  const [isNavigationMenuOpen, setIsNavigationMenuOpen] = useState(false);

  const nextStop = useMemo(() => {
    const currentStopIndex = currentStopId
      ? stops.findIndex((stop) => stop.id === currentStopId)
      : -1;

    if (currentStopIndex >= 0) {
      const currentStop = stops[currentStopIndex];
      if (currentStop?.type === 'stop') {
        return currentStop;
      }

      const nextStopAfterCurrent = stops
        .slice(currentStopIndex + 1)
        .find((stop) => stop.type === 'stop');
      if (nextStopAfterCurrent) {
        return nextStopAfterCurrent;
      }
    }

    return stops.find((stop) => stop.type === 'stop');
  }, [currentStopId, stops]);

  const deliveredCount = passengers.filter((p) => p.status === 'boarded').length;
  const totalCount = passengers.length;

  const handleOpenWaze = async () => {
    setIsNavigationMenuOpen(false);
    // Preferir latitude/longitude se disponível, caso contrário usar endereço
    const lat = nextStop?.latitude;
    const lng = nextStop?.longitude;
    let opened = false;

    if (typeof lat === 'number' && typeof lng === 'number') {
      opened = await openWazeNavigation({ latitude: lat, longitude: lng });
    } else {
      const nextStopAddress = nextStop?.address?.trim();
      if (!nextStopAddress) {
        Alert.alert('Navegação', 'Não foi possível identificar a próxima parada.');
        return;
      }

      opened = await openWazeNavigation({ address: nextStopAddress });
    }

    if (!opened) {
      const urls = getWazeUrls({
        latitude: lat ?? undefined,
        longitude: lng ?? undefined,
        address: nextStop?.address ?? undefined,
      });

      const webUrl = urls.find((u) => u.startsWith('https://'));

      Alert.alert(
        'Navegação',
        'Não foi possível abrir o Waze neste dispositivo. Deseja abrir a versão web?',
        [
          {
            text: 'Abrir Waze Web',
            onPress: () => {
              if (webUrl) {
                Linking.openURL(webUrl);
              } else {
                Alert.alert('Navegação', 'URL de fallback não disponível.');
              }
            },
          },
          { text: 'Cancelar', style: 'cancel' },
        ],
      );
    }
  };

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
              backgroundImage={data.backgroundImage ? { uri: data.backgroundImage } : undefined}
              style={[styles.heroHeader, { minHeight: heroHeight }]}
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paradas</Text>
          <RouteStopList stops={stops} currentStopId={currentStopId} />
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

      <View style={styles.navigationFabContainer}>
        <NavigationFab
          isOpen={isNavigationMenuOpen}
          onToggle={() => setIsNavigationMenuOpen((v) => !v)}
          onWazePress={handleOpenWaze}
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
  navigationFabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 32,
    zIndex: 20,
  },
});
