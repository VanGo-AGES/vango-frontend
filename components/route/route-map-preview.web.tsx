import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { colors } from '@/styles/colors';

const DEFAULT_MAP_IMAGE = require('@/assets/images/map-mock.png');

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type RouteMapPreviewProps = {
  origin?: Coordinates;
  destination?: Coordinates;
  variant?: 'hero' | 'card' | 'thumbnail';
};

export function RouteMapPreview({ variant = 'thumbnail' }: RouteMapPreviewProps) {
  return (
    <View style={[styles.base, styles[variant]]}>
      <Image source={DEFAULT_MAP_IMAGE} style={StyleSheet.absoluteFillObject} contentFit="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    backgroundColor: colors.light,
    position: 'relative',
  },
  hero: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    ...StyleSheet.absoluteFillObject,
  },
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
});
