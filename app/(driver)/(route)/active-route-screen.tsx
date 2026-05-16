import { useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActiveRouteMap } from '@/components/route/active-route-map';
import { NavigationFab } from '@/components/route/navigation-fab';
import { RouteTopBar } from '@/components/route/route-top-bar';
import { TripBottomSheet } from '@/components/route/trip-bottom-sheet';
import { colors } from '@/styles/colors';

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

  const bottomPadding = Math.max(24, insets.bottom);
  const sheetMaxHeight = 570 + bottomPadding;
  const sheetMinHeight = 310;
  const sheetMaxTranslateY = sheetMaxHeight - sheetMinHeight;
  const floatingActionsBottom = sheetMaxHeight + 32;

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
          <NavigationFab isOpen={navigationMenuOpen} onPress={handleNavigationPress} />
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
