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
import { getDriverCurrentTrip } from '@/services/trip.service';
import { useDriverRoutes } from '@/hooks/use-driver-routes';
import { useSessionStore } from '@/store/session.store';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

const headerLocation = 'Porto Alegre, RS';
// TODO: Remover estes mocks quando o backend enviar as coordenadas
const MOCK_ORIGIN = { latitude: -30.0277, longitude: -51.1632 }; // Shopping Iguatemi
const MOCK_DESTINATION = { latitude: -30.0495, longitude: -51.2287 }; // Shopping Praia de Belas

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

  const nextRoute = getNextRoute(routesData);
  const myRoutes = routesData;

  const openRouteDetails = (routeId: string) => {
    router.push({
      pathname: '/(driver)/(route)/route-details-screen' as never,
      params: { routeId },
    });
  };

  const handleOpenRoute = async (route: { id: string; status?: string }) => {
    if (route.status === 'em_andamento') {
      try {
        const currentTrip = await getDriverCurrentTrip(route.id);
        if (currentTrip?.trip_id) {
          router.push({
            pathname: '/(driver)/(route)/active-route-details-screen' as never,
            params: { routeId: route.id, tripId: currentTrip.trip_id },
          });
          return;
        }
      } catch {}
    }

    openRouteDetails(route.id);
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
        : MOCK_ORIGIN,
    destination:
      route.destination_address?.latitude && route.destination_address?.longitude
        ? {
            latitude: route.destination_address.latitude,
            longitude: route.destination_address.longitude,
          }
        : MOCK_DESTINATION,
    onPress: () => handleOpenRoute(route),
  }));

  const handleProfilePress = () => {
    router.push('/profile-driver-screen');
  };

  // TODO: substituir por rota de configurações quando a tela existir.
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
          name={sessionUser?.name ?? 'João Silva'}
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
                  : MOCK_ORIGIN
              }
              destination={
                nextRoute.destination_address?.latitude && nextRoute.destination_address?.longitude
                  ? {
                      latitude: nextRoute.destination_address.latitude,
                      longitude: nextRoute.destination_address.longitude,
                    }
                  : MOCK_DESTINATION
              }
              onPress={() => handleOpenRoute(nextRoute)}
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
  container: {
    paddingHorizontal: 0,
  },
  headerSpacing: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  section: {
    gap: 12,
  },
  sectionWithTopSpacing: {
    flex: 1,
    gap: 12,
    marginTop: 36,
  },
  panel: {
    backgroundColor: colors.light,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  emptyStateWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionTitle: {
    ...typography.body,
    color: colors.dark,
    paddingHorizontal: 24,
  },
  buttonContainer: {
    paddingHorizontal: 24,
  },
  createRouteButton: {
    width: '100%',
    minHeight: 40,
  },
  routesList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  routesListContent: {
    gap: 16,
  },
});
