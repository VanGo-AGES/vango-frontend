import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';

import RecenterMapButtonIcon from '@/assets/images/recenter-map-button.svg';
import { colors, withAlpha } from '@/styles/colors';

import { RecenterMapButton } from './recenter-map-button';

export type ActiveRouteMapProps = {
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;
  nextStopLocation: {
    latitude: number;
    longitude: number;
  };
  onRecenterPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  recenterButtonStyle?: StyleProp<ViewStyle> | AnimatedStyle<ViewStyle>;
  liveRefreshIntervalMs?: number;
  followCurrentLocation?: boolean;
};

export function ActiveRouteMap({
  currentLocation,
  nextStopLocation,
  onRecenterPress,
  containerStyle,
  recenterButtonStyle,
}: ActiveRouteMapProps) {
  const center = currentLocation ?? nextStopLocation;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.grid}>
        <View style={styles.routeLine} />
        {currentLocation && <View style={[styles.pin, styles.currentPin]} />}
        <View style={[styles.pin, styles.nextPin]} />
      </View>

      <View style={styles.coordinates}>
        <Text style={styles.coordinateText}>{center.latitude.toFixed(5)}</Text>
        <Text style={styles.coordinateText}>{center.longitude.toFixed(5)}</Text>
      </View>

      <View pointerEvents="box-none" style={styles.overlay}>
        <Animated.View style={recenterButtonStyle}>
          <RecenterMapButton
            onPress={onRecenterPress ?? (() => {})}
            style={styles.recenterButton}
            icon={<RecenterMapButtonIcon width={24} height={24} />}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: colors.light,
    position: 'relative',
  },
  grid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: withAlpha(colors.primary, 0.08),
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeLine: {
    width: '72%',
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.secondary,
    transform: [{ rotate: '-22deg' }],
  },
  pin: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: colors.white,
  },
  currentPin: {
    left: '24%',
    top: '58%',
    backgroundColor: colors.dark,
  },
  nextPin: {
    right: '24%',
    top: '36%',
    backgroundColor: colors.secondary,
  },
  coordinates: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    gap: 2,
  },
  coordinateText: {
    color: colors.dark,
    fontSize: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 16,
  },
  recenterButton: {
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
});
