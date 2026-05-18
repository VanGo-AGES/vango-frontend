import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import MapView, { Marker, Polyline, type Region } from 'react-native-maps';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';

import CurrentLocationPin from '@/assets/images/localizacao-atual.svg';
import NextStopPin from '@/assets/images/proxima-parada.svg';
import RecenterMapButtonIcon from '@/assets/images/recenter-map-button.svg';
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
  containerStyle?: StyleProp<ViewStyle>;
  recenterButtonStyle?: StyleProp<ViewStyle> | AnimatedStyle<ViewStyle>;
};

const MIN_DELTA = 0.008;
const PATH_POINTS = 14;
const MARKER_ANCHOR = { x: 0.5, y: 1 } as const;

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

async function fetchRealRoutePoints(
  currentLocation: ActiveRouteMapProps['currentLocation'],
  nextStopLocation: ActiveRouteMapProps['nextStopLocation'],
) {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${currentLocation.longitude},${currentLocation.latitude};${nextStopLocation.longitude},${nextStopLocation.latitude}?geometries=geojson`,
    );

    if (!response.ok) throw new Error('Route fetch failed');

    const data = (await response.json()) as any;

    if (data.routes && data.routes[0]?.geometry?.coordinates) {
      return data.routes[0].geometry.coordinates.map((coord: [number, number]) => ({
        latitude: coord[1],
        longitude: coord[0],
      }));
    }
  } catch {}

  return buildMockRoutePoints(currentLocation, nextStopLocation);
}

export function ActiveRouteMap({
  currentLocation,
  nextStopLocation,
  onRecenterPress,
  containerStyle,
  recenterButtonStyle,
}: ActiveRouteMapProps) {
  const mapRef = useRef<MapView>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  const initialRegion = useMemo(
    () => buildInitialRegion(currentLocation, nextStopLocation),
    [currentLocation, nextStopLocation],
  );

  useEffect(() => {
    fetchRealRoutePoints(currentLocation, nextStopLocation).then(setRouteCoordinates);
  }, [currentLocation, nextStopLocation]);

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
    <View style={[styles.container, containerStyle]}>
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
        <Marker coordinate={currentLocation} title="Sua localização" anchor={MARKER_ANCHOR}>
          <CurrentLocationPin width={40} height={40} />
        </Marker>

        <Marker coordinate={nextStopLocation} title="Próxima parada" anchor={MARKER_ANCHOR}>
          <NextStopPin width={32.04} height={50} />
        </Marker>

        {routeCoordinates.length > 0 && (
          <>
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
          </>
        )}
      </MapView>

      <View pointerEvents="box-none" style={styles.overlay}>
        <Animated.View style={recenterButtonStyle}>
          <RecenterMapButton
            onPress={handleRecenterPress}
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
    height: 280,
    overflow: 'hidden',
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 16,
  },
  recenterButton: {
    alignSelf: 'flex-start',
  },
});
