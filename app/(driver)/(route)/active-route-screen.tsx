import { useMemo, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { Alert, Linking, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActiveRouteMap } from '@/components/route/active-route-map';
import { NavigationFab } from '@/components/route/navigation-fab';
import { RouteTopBar } from '@/components/route/route-top-bar';
import { TripBottomSheet } from '@/components/route/trip-bottom-sheet';
import { useRouteStops } from '@/hooks/use-route-stops';
import { openWazeNavigation, getWazeUrls } from '@/lib/waze-navigation';
import { colors } from '@/styles/colors';

const ROUTE_ID = 'route-1';

const MOCK_CURRENT_LOCATION = {
  latitude: -30.0346,
  longitude: -51.2177,
};

const MOCK_NEXT_STOP_LOCATION = {
  latitude: -30.0378,
  longitude: -51.2232,
};

const MOCK_NEXT_STOP = {
  id: 'stop-1',
  address: 'Av. Bento Gonçalves, 500',
};

const MOCK_PASSENGER = {
  id: 'passenger-1',
  name: 'Mateus Cunha',
  avatarUrl: undefined,
  phoneNumber: '51999999999',
};

export default function DriverActiveRouteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [navigationMenuOpen, setNavigationMenuOpen] = useState(false);

  const { stops, currentStopId } = useRouteStops({ routeId: ROUTE_ID });

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

  const bottomPadding = Math.max(24, insets.bottom);
  const sheetMaxHeight = 570 + bottomPadding;
  const sheetMinHeight = 310;
  const sheetMaxTranslateY = sheetMaxHeight - sheetMinHeight;

  const sheetTranslateY = useSharedValue(sheetMaxTranslateY);

  const floatingButtonsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
  }));

  const handleBackPress = () => {
    router.push('/driver-home');
  };

  const handleNavigationPress = () => {
    setNavigationMenuOpen((current) => !current);
  };

  const handleRecenterPress = () => undefined;

  const handleSkipStop = () => undefined;

  const handleOpenWaze = async () => {
    setNavigationMenuOpen(false);

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

      const webUrl = urls.find((url) => url.startsWith('https://'));

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
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.screen}>
        <ActiveRouteMap
          currentLocation={MOCK_CURRENT_LOCATION}
          nextStopLocation={MOCK_NEXT_STOP_LOCATION}
          onRecenterPress={handleRecenterPress}
          containerStyle={styles.map}
          recenterButtonStyle={[styles.recenterButtonPosition, floatingButtonsStyle]}
        />

        <View style={styles.topBarContainer}>
          <RouteTopBar onBackPress={handleBackPress} showMenu={false} />
        </View>

        <Animated.View pointerEvents="box-none" style={[styles.fabContainer, floatingButtonsStyle]}>
          <NavigationFab
            isOpen={navigationMenuOpen}
            onToggle={handleNavigationPress}
            onWazePress={handleOpenWaze}
          />
        </Animated.View>

        <TripBottomSheet
          nextStop={MOCK_NEXT_STOP}
          passenger={MOCK_PASSENGER}
          timeRemaining={6}
          estimatedArrival="18h43"
          distance="1.4km"
          onSkipStop={handleSkipStop}
          translateY={sheetTranslateY}
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
    height: undefined,
    borderWidth: 0,
  },
  topBarContainer: {
    position: 'absolute',
    top: 52,
    left: 4,
    right: 4,
    zIndex: 20,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 636,
    alignItems: 'flex-end',
  },
  recenterButtonPosition: {
    marginBottom: 620,
  },
});
