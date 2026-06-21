import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useRouteDetail } from '@/hooks/use-route-detail';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import OriginPin from '@/assets/images/localizacao-atual.svg';
import StopPin from '@/assets/images/proxima-parada.svg';
import DestinationPin from '@/assets/images/destino-final.svg';

type Coord = { latitude: number; longitude: number };

const MARKER_ANCHOR = { x: 0.5, y: 1 } as const;
const CIRCLE_ANCHOR = { x: 0.5, y: 0.5 } as const;

async function fetchRoutePolyline(waypoints: Coord[]): Promise<Coord[]> {
  if (waypoints.length < 2) return waypoints;
  const coords = waypoints.map((p) => `${p.longitude},${p.latitude}`).join(';');
  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coords}?geometries=geojson&overview=full`,
    );
    if (!res.ok) throw new Error('Route fetch failed');
    const data = (await res.json()) as {
      routes?: { geometry?: { coordinates?: [number, number][] } }[];
    };
    if (data.routes?.[0]?.geometry?.coordinates) {
      return data.routes[0].geometry.coordinates.map(([lon, lat]) => ({
        latitude: lat,
        longitude: lon,
      }));
    }
  } catch {
    // fallback to straight lines between waypoints
  }
  return waypoints;
}

function buildInitialRegion(waypoints: Coord[]) {
  if (waypoints.length === 0) {
    return { latitude: -23.5, longitude: -46.6, latitudeDelta: 0.15, longitudeDelta: 0.15 };
  }
  const lats = waypoints.map((p) => p.latitude);
  const lons = waypoints.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const padding = 1.5;
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLon + maxLon) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * padding, 0.012),
    longitudeDelta: Math.max((maxLon - minLon) * padding, 0.012),
  };
}

export default function RoutePreviewMapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const mapRef = useRef<MapView>(null);

  const { data: route, isLoading } = useRouteDetail(routeId);
  const [polyline, setPolyline] = useState<Coord[]>([]);
  const [polylineLoading, setPolylineLoading] = useState(false);

  // origem → paradas (order_index) → destino
  const waypoints = useMemo<Coord[]>(() => {
    if (!route) return [];
    const pts: Coord[] = [];

    const { origin_address, destination_address, stops } = route;

    if (origin_address.latitude != null && origin_address.longitude != null) {
      pts.push({ latitude: origin_address.latitude, longitude: origin_address.longitude });
    }

    const sorted = [...stops].sort((a, b) => a.order_index - b.order_index);
    for (const stop of sorted) {
      if (stop.address.latitude != null && stop.address.longitude != null) {
        pts.push({ latitude: stop.address.latitude, longitude: stop.address.longitude });
      }
    }

    if (destination_address.latitude != null && destination_address.longitude != null) {
      pts.push({
        latitude: destination_address.latitude,
        longitude: destination_address.longitude,
      });
    }

    return pts;
  }, [route]);

  const initialRegion = useMemo(() => buildInitialRegion(waypoints), [waypoints]);

  // Exibe linhas retas imediatamente e sobrepõe com rota real do OSRM
  useEffect(() => {
    if (waypoints.length < 2) {
      setPolyline([]);
      return;
    }
    // fallback imediato: linhas retas entre os pontos
    setPolyline(waypoints);

    setPolylineLoading(true);
    void fetchRoutePolyline(waypoints)
      .then((pts) => {
        // só usa OSRM se retornou mais pontos que os waypoints brutos
        if (pts.length > waypoints.length) {
          setPolyline(pts);
        }
      })
      .finally(() => setPolylineLoading(false));
  }, [waypoints]);

  // Ajusta câmera para mostrar toda a rota após carregar a polyline
  useEffect(() => {
    if (polyline.length > 0) {
      mapRef.current?.fitToCoordinates(polyline, {
        edgePadding: { top: 80, right: 40, bottom: 80, left: 40 },
        animated: true,
      });
    }
  }, [polyline]);

  const originCoord = useMemo<Coord | null>(() => {
    if (!route) return null;
    const a = route.origin_address;
    return a.latitude != null && a.longitude != null
      ? { latitude: a.latitude, longitude: a.longitude }
      : null;
  }, [route]);

  const destinationCoord = useMemo<Coord | null>(() => {
    if (!route) return null;
    const a = route.destination_address;
    return a.latitude != null && a.longitude != null
      ? { latitude: a.latitude, longitude: a.longitude }
      : null;
  }, [route]);

  const stopCoords = useMemo<{ coord: Coord; index: number }[]>(() => {
    if (!route) return [];
    return [...route.stops]
      .sort((a, b) => a.order_index - b.order_index)
      .filter((s) => s.address.latitude != null && s.address.longitude != null)
      .map((s, i) => ({
        index: i + 1,
        coord: { latitude: s.address.latitude!, longitude: s.address.longitude! },
      }));
  }, [route]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando rota...</Text>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFill}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            initialRegion={initialRegion}
            zoomEnabled
            scrollEnabled
            rotateEnabled={false}
            pitchEnabled={false}
            showsCompass={false}
            showsScale={false}
            toolbarEnabled={false}
            moveOnMarkerPress={false}
          >
            {/* Polyline */}
            {polyline.length > 1 && (
              <>
                <Polyline
                  coordinates={polyline}
                  strokeColor="#00000033"
                  strokeWidth={7}
                  lineCap="round"
                  lineJoin="round"
                />
                <Polyline
                  coordinates={polyline}
                  strokeColor={colors.secondary}
                  strokeWidth={4}
                  lineCap="round"
                  lineJoin="round"
                />
              </>
            )}

            {/* Origem */}
            {originCoord && (
              <Marker coordinate={originCoord} title="Origem" anchor={CIRCLE_ANCHOR}>
                <OriginPin width={40} height={40} />
              </Marker>
            )}

            {/* Paradas intermediárias */}
            {stopCoords.map(({ coord, index }) => (
              <Marker
                key={index}
                coordinate={coord}
                title={`Parada ${index}`}
                anchor={MARKER_ANCHOR}
              >
                <StopPin width={28} height={44} />
              </Marker>
            ))}

            {/* Destino final */}
            {destinationCoord && (
              <Marker coordinate={destinationCoord} title="Destino final" anchor={MARKER_ANCHOR}>
                <DestinationPin width={28} height={44} />
              </Marker>
            )}
          </MapView>
        )}

        {/* Botão voltar */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backButton, { top: insets.top + 12 }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Voltar"
        >
          <MaterialIcons name="arrow-back" size={22} color={colors.dark} />
        </TouchableOpacity>

        {/* Nome da rota */}
        {route && (
          <View style={[styles.routeNameBadge, { top: insets.top + 12 }]} pointerEvents="none">
            <Text style={styles.routeNameText} numberOfLines={1}>
              {route.name}
            </Text>
          </View>
        )}

        {/* Indicador de carregamento da polyline */}
        {polylineLoading && !isLoading && (
          <View style={styles.polylineLoadingBadge} pointerEvents="none">
            <ActivityIndicator size="small" color={colors.secondary} />
            <Text style={styles.polylineLoadingText}>Traçando rota...</Text>
          </View>
        )}

        {/* Legenda */}
        {!isLoading && (
          <View style={[styles.legend, { bottom: insets.bottom + 24 }]} pointerEvents="none">
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: '#FFEE8C', borderWidth: 2, borderColor: colors.dark },
                ]}
              />
              <Text style={styles.legendLabel}>Origem</Text>
            </View>
            {stopCoords.length > 0 && (
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.secondary }]} />
                <Text style={styles.legendLabel}>
                  {stopCoords.length} {stopCoords.length === 1 ? 'parada' : 'paradas'}
                </Text>
              </View>
            )}
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
              <Text style={styles.legendLabel}>Destino</Text>
            </View>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    ...typography.body,
    color: colors.subtleText,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  routeNameBadge: {
    position: 'absolute',
    left: 68,
    right: 16,
    height: 40,
    backgroundColor: colors.light,
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  routeNameText: {
    ...typography.bodyBold,
    color: colors.dark,
  },
  polylineLoadingBadge: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.light,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  polylineLoadingText: {
    ...typography.small,
    color: colors.subtleText,
  },
  legend: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 16,
    backgroundColor: colors.light,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    ...typography.small,
    color: colors.dark,
  },
});
