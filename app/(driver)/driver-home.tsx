import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';

import { HomeHeaderCard } from '@/components/route/home-header-card';
import { EmptyState } from '@/components/general/empty-state';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { ActionPillButton } from '@/components/route/action-pill-button';
import { NextRouteCard } from '@/components/route/next-route-card';
import { RouteList } from '@/components/route/route-list';
import { apiGet } from '@/services/api';
import { useSessionStore } from '@/store/session.store';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

const headerLocation = 'Porto Alegre, RS';
const ROUTES_QUERY_KEY = ['routes'];

type Route = {
  id: string;
  name: string;
  status: 'inativa' | 'ativa';
  recurrence: string;
  expected_time: string;
  distance?: string | null;
  distance_km?: number | null;
  duration?: string | null;
  duration_minutes?: number | null;
};

async function fetchRoutes(): Promise<Route[]> {
  const user = useSessionStore.getState().user;
  const headers = { 'X-User-Id': user?.id ?? '', 'X-User-Role': 'driver' };
  return apiGet('/routes/', headers);
}

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

function formatDistance(route: { distance?: string | null; distance_km?: number | null }) {
  if (route.distance) return route.distance;
  if (typeof route.distance_km === 'number') return `${route.distance_km} km`;
  return '10 km';
}

function formatDuration(route: { duration?: string | null; duration_minutes?: number | null }) {
  if (route.duration) return route.duration;
  if (typeof route.duration_minutes === 'number') {
    const hours = Math.floor(route.duration_minutes / 60);
    const minutes = route.duration_minutes % 60;
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
  }
  return '30min';
}

export default function DriverHomeScreen() {
  const router = useRouter();
  const sessionUser = useSessionStore((s) => s.user);
  const localPhotoUri = useSessionStore((s) => s.localPhotoUri);
  const { data: routesData = [] as Route[] } = useQuery({
    queryKey: ROUTES_QUERY_KEY,
    queryFn: fetchRoutes,
    enabled: !!sessionUser?.id,
    staleTime: 0,
  });

  const nextRoute = routesData.find((route) => route.status === 'inativa') ?? routesData[0] ?? null;
  const myRoutes = routesData;
  const routeItems = myRoutes.map((route) => ({
    name: route.name,
    days: formatRecurrence(route.recurrence),
    duration: formatDuration(route),
    distance: formatDistance(route),
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
          {nextRoute ? (
            <NextRouteCard
              routeName={nextRoute.name}
              dateLabel={formatRecurrence(nextRoute.recurrence) || 'Próxima rota'}
              time={formatTime(nextRoute.expected_time)}
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

        {myRoutes.length > 0 ? (
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
  content: {
    paddingBottom: 32,
  },
  headerSpacing: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  section: {
    gap: 12,
  },
  sectionWithTopSpacing: {
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
    paddingHorizontal: 24,
  },
  routesListContent: {
    gap: 16,
  },
});
