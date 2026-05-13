import { useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, type Region } from 'react-native-maps';

import { colors, withAlpha } from '@/styles/colors';

import { RecenterMapButton } from './recenter-map-button';

export type ActiveRouteMapProps = {
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  nextStopLocation: {
    latitude: number;
    longitude: number;
  };
  onRecenterPress?: () => void;
};

const MIN_DELTA = 0.008;
const PATH_POINTS = 14;

function buildInitialRegion(
  currentLocation: ActiveRouteMapProps['currentLocation'],
  nextStopLocation: ActiveRouteMapProps['nextStopLocation'],
): Region {
  const latitudeDelta = Math.max(
    Math.abs(currentLocation.latitude - nextStopLocation.latitude) * 1.8,
    MIN_DELTA,
  );
  const longitudeDelta = Math.max(
    Math.abs(currentLocation.longitude - nextStopLocation.longitude) * 1.8,
    MIN_DELTA,
  );

  return {
    latitude: (currentLocation.latitude + nextStopLocation.latitude) / 2,
    longitude: (currentLocation.longitude + nextStopLocation.longitude) / 2,
    latitudeDelta,
    longitudeDelta,
  };
}

function buildMockRoutePoints(
  currentLocation: ActiveRouteMapProps['currentLocation'],
  nextStopLocation: ActiveRouteMapProps['nextStopLocation'],
) {
  const latitudeDelta = nextStopLocation.latitude - currentLocation.latitude;
  const longitudeDelta = nextStopLocation.longitude - currentLocation.longitude;
  const distance = Math.max(Math.hypot(latitudeDelta, longitudeDelta), MIN_DELTA);
  const bendLatitude = -longitudeDelta * 0.18;
  const bendLongitude = latitudeDelta * 0.18;

  return Array.from({ length: PATH_POINTS }, (_, index) => {
    const progress = index / (PATH_POINTS - 1);
    const curve = Math.sin(Math.PI * progress) * distance * 0.25;

    return {
      latitude: currentLocation.latitude + latitudeDelta * progress + bendLatitude * curve,
      longitude: currentLocation.longitude + longitudeDelta * progress + bendLongitude * curve,
    };
  });
}

export function ActiveRouteMap({
  currentLocation,
  nextStopLocation,
  onRecenterPress,
}: ActiveRouteMapProps) {
  const mapRef = useRef<MapView>(null);

  const initialRegion = useMemo(
    () => buildInitialRegion(currentLocation, nextStopLocation),
    [currentLocation, nextStopLocation],
  );

  const routeCoordinates = useMemo(
    () => buildMockRoutePoints(currentLocation, nextStopLocation),
    [currentLocation, nextStopLocation],
  );

  const handleRecenterPress = () => {
    mapRef.current?.animateToRegion(
      {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: initialRegion.latitudeDelta,
        longitudeDelta: initialRegion.longitudeDelta,
      },
      350,
    );
    onRecenterPress?.();
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        zoomEnabled
        scrollEnabled
        rotateEnabled
        pitchEnabled
        showsCompass={false}
        showsScale={false}
        toolbarEnabled={false}
        loadingEnabled
        moveOnMarkerPress={false}
      >
        <Marker coordinate={currentLocation} title="Sua localização" pinColor={colors.secondary} />
        <Marker coordinate={nextStopLocation} title="Próxima parada" pinColor={colors.primary} />

        <Polyline
          coordinates={routeCoordinates}
          strokeColor={withAlpha(colors.dark, 0.35)}
          strokeWidth={6}
          lineCap="round"
          lineJoin="round"
        />
        <Polyline
          coordinates={routeCoordinates}
          strokeColor={colors.secondary}
          strokeWidth={3}
          lineCap="round"
          lineJoin="round"
        />
      </MapView>

      <View pointerEvents="box-none" style={styles.overlay}>
        <RecenterMapButton onPress={handleRecenterPress} style={styles.recenterButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 16,
  },
  recenterButton: {
    alignSelf: 'flex-end',
  },
});
