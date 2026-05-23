import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
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

export function RouteMapPreview({
  origin,
  destination,
  variant = 'thumbnail',
}: RouteMapPreviewProps) {
  if (!origin || !destination) {
    return (
      <View style={[styles.base, styles[variant]]}>
        <Image
          source={DEFAULT_MAP_IMAGE}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
        />
      </View>
    );
  }

  const latDelta = Math.abs(origin.latitude - destination.latitude);
  const lngDelta = Math.abs(origin.longitude - destination.longitude);

  const isThumbnail = variant === 'thumbnail';

  const verticalShift = isThumbnail ? 0 : latDelta * 0.25;

  const zoomMultiplier = isThumbnail ? 1.5 : 2.5;

  const region = {
    latitude: (origin.latitude + destination.latitude) / 2 - verticalShift,
    longitude: (origin.longitude + destination.longitude) / 2,
    latitudeDelta: Math.max(latDelta * zoomMultiplier, 0.02),
    longitudeDelta: Math.max(lngDelta * zoomMultiplier, 0.02),
  };

  return (
    <View style={[styles.base, styles[variant]]}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        liteMode={true}
        pitchEnabled={false}
        zoomEnabled={false}
        scrollEnabled={false}
        rotateEnabled={false}
        toolbarEnabled={false}
      >
        <Marker coordinate={origin} pinColor={colors.primary} />
        <Marker coordinate={destination} pinColor={colors.secondary} />
      </MapView>
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
