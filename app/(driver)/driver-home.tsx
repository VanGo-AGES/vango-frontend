import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { HomeHeaderCard } from '@/components/route/home-header-card';
import { EmptyState } from '@/components/general/empty-state';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { ActionPillButton } from '@/components/route/action-pill-button';
import { NextRouteCard } from '@/components/route/next-route-card';
import { RouteList } from '@/components/route/route-list';
import { getNextRoute } from '@/services/route.service';
import { useDriverRoutes } from '@/hooks/use-driver-routes';
import { useSessionStore } from '@/store/session.store';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

function formatRecurrence(recurrence: string) {
  return recurrence
    .split(',')
    .map((day) => day.trim())
    .filter(Boolean)
    .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
    .join(' • ');
}

function formatTime(value: string) {
  return value.length >= 5 ? value.slice(0, 5) : value;
}

function formatDistance(route: { total_distance_km?: number | null }) {
  if (typeof route.total_distance_km === 'number') {
    return `${route.total_distance_km.toFixed(1)} km`;
  }
  return '10 km';
}

function formatDuration(route: { estimated_duration_min?: number | null }) {
  if (typeof route.estimated_duration_min === 'number') {
    const hours = Math.floor(route.estimated_duration_min / 60);
    const minutes = route.estimated_duration_min % 60;
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
  }
  return '30min';
}

export default function DriverHomeScreen() {
  const router = useRouter();
  const sessionUser = useSessionStore((s) => s.user);
  const localPhotoUri = useSessionStore((s) => s.localPhotoUri);
  const { data: routesData = [], isLoading, isError } = useDriverRoutes();

  const [headerLocation, setHeaderLocation] = useState('Buscando local...');
  useEffect(() => {
    (async () => {
      try {
        // Pede permissão (caso ainda não tenha dado)
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setHeaderLocation('Localização negada');
          return;
        }

        // Pega a coordenada atual
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        // Transforma a Lat/Lng em endereço (Reverse Geocoding)
        const geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (geocode.length > 0) {
          const place = geocode[0];
          // No Brasil, a cidade pode vir em 'subregion' ou 'city', e o estado vem em 'region'
          const city = place.subregion || place.city || 'Cidade Desconhecida';
          const state = place.region || '';

          setHeaderLocation(`${city}${state ? `, ${state}` : ''}`);
        } else {
          setHeaderLocation('Local não encontrado');
        }
      } catch (error) {
        setHeaderLocation('Localização indisponível');
      }
    })();
  }, []);

  const nextRoute = getNextRoute(routesData);
  const myRoutes = routesData;

  const handleOpenRouteDetails = (routeId: string) => {
    const clickedRoute = routesData.find((r) => r.id === routeId);

    if (clickedRoute?.status === 'em_andamento') {
      const activeTripId = clickedRoute?.active_trip_id;

      if (!activeTripId) {
        router.push({
          pathname: '/(driver)/(route)/route-details-screen' as never,
          params: { routeId },
        });
        return;
      }

      router.push({
        pathname: '/(driver)/(route)/active-route-details-screen' as never,
        params: { routeId, tripId: activeTripId },
      });
    } else {
      router.push({
        pathname: '/(driver)/(route)/route-details-screen' as never,
        params: { routeId },
      });
    }
  };

  const routeItems = myRoutes.map((route) => ({
    id: route.id,
    name: route.name,
    days: formatRecurrence(route.recurrence),
    duration: formatDuration(route),
    distance: formatDistance(route),
    origin:
      route.origin_address?.latitude && route.origin_address?.longitude
        ? { latitude: route.origin_address.latitude, longitude: route.origin_address.longitude }
        : undefined,
    destination:
      route.destination_address?.latitude && route.destination_address?.longitude
        ? {
            latitude: route.destination_address.latitude,
            longitude: route.destination_address.longitude,
          }
        : undefined,
    onPress: () => handleOpenRouteDetails(route.id),
  }));

  const handleProfilePress = () => {
    router.push('/profile-driver-screen');
  };

  const handleSettingsPress = () => {
    router.push('/profile-driver-screen');
  };

  const handleCreateRoutePress = () => {
    router.push('/create-route-info-screen');
  };

  return (
    <AppScreenContainer
      backgroundColor={colors.white}
      edges={['top', 'bottom']}
      style={styles.container}
    >
      <View style={styles.headerSpacing}>
        <HomeHeaderCard
          name={sessionUser?.name ?? 'Motorista'}
          location={headerLocation}
          avatarUri={localPhotoUri ?? sessionUser?.photo_url ?? undefined}
          onProfilePress={handleProfilePress}
          onSettingsPress={handleSettingsPress}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próxima Rota</Text>

        <View style={styles.panel}>
          {isLoading ? (
            <EmptyState icon="schedule" text="Carregando a próxima rota do motorista..." />
          ) : isError ? (
            <EmptyState
              icon="error-outline"
              text="Não foi possível carregar a próxima rota. Tente novamente em instantes."
            />
          ) : nextRoute ? (
            <NextRouteCard
              routeName={nextRoute.name}
              dateLabel={formatRecurrence(nextRoute.recurrence) || 'Próxima rota'}
              time={formatTime(nextRoute.expected_time)}
              origin={
                nextRoute.origin_address?.latitude && nextRoute.origin_address?.longitude
                  ? {
                      latitude: nextRoute.origin_address.latitude,
                      longitude: nextRoute.origin_address.longitude,
                    }
                  : undefined
              }
              destination={
                nextRoute.destination_address?.latitude && nextRoute.destination_address?.longitude
                  ? {
                      latitude: nextRoute.destination_address.latitude,
                      longitude: nextRoute.destination_address.longitude,
                    }
                  : undefined
              }
              onPress={() => handleOpenRouteDetails(nextRoute.id)}
            />
          ) : (
            <View style={styles.emptyStateWrapper}>
              <EmptyState
                icon="event"
                text="Nenhuma rota agendada. Crie uma rota para começar a organizar seus trajetos."
              />
            </View>
          )}
        </View>
      </View>

      <View style={styles.sectionWithTopSpacing}>
        <Text style={styles.sectionTitle}>Minhas Rotas</Text>

        <View style={styles.buttonContainer}>
          <ActionPillButton
            onPress={handleCreateRoutePress}
            label="Criar Rota"
            icon={<MaterialIcons name="add" size={20} color={colors.dark} />}
            style={styles.createRouteButton}
          />
        </View>

        {isLoading ? (
          <View style={styles.emptyStateWrapper}>
            <EmptyState icon="schedule" text="Carregando suas rotas..." />
          </View>
        ) : isError ? (
          <View style={styles.emptyStateWrapper}>
            <EmptyState
              icon="error-outline"
              text="Não foi possível carregar suas rotas no momento. Tente novamente."
            />
          </View>
        ) : myRoutes.length > 0 ? (
          <RouteList
            routes={routeItems}
            style={styles.routesList}
            contentContainerStyle={styles.routesListContent}
          />
        ) : (
          <View style={styles.emptyStateWrapper}>
            <EmptyState
              icon="directions-car"
              text={'Você ainda não criou nenhuma rota. Toque em "Criar rota" para começar.'}
            />
          </View>
        )}
      </View>
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 0 },
  headerSpacing: { paddingHorizontal: 24, marginBottom: 32 },
  section: { gap: 12 },
  sectionWithTopSpacing: { flex: 1, gap: 12, marginTop: 36 },
  panel: { backgroundColor: colors.light, paddingHorizontal: 24, paddingVertical: 24 },
  emptyStateWrapper: { paddingHorizontal: 24, paddingVertical: 24 },
  sectionTitle: { ...typography.body, color: colors.dark, paddingHorizontal: 24 },
  buttonContainer: { paddingHorizontal: 24 },
  createRouteButton: { width: '100%', minHeight: 40 },
  routesList: { flex: 1, paddingHorizontal: 24 },
  routesListContent: { gap: 16 },
});
