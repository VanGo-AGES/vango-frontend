import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { ActionPillButton } from '@/components/route/action-pill-button';
import { EmptyState } from '@/components/general/empty-state';
import { HomeHeaderCard } from '@/components/route/home-header-card';
import { NextRouteCard } from '@/components/route/next-route-card';
import { RouteList } from '@/components/route/route-list';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { getNextPassangerRoute } from '@/services/route-passanger.service';
import { usePassangerRoutes } from '@/hooks/use-passanger-routes';
import { useSessionStore } from '@/store/session.store';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

const headerLocation = 'Porto Alegre, RS';

function formatRecurrence(recurrence: string[]): string {
  return recurrence
    .map((day) => day.trim())
    .filter(Boolean)
    .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
    .join(' • ');
}

function formatTime(value: string): string {
  return value.length >= 5 ? value.slice(0, 5) : value;
}

export default function PassengerHomeScreen() {
  const router = useRouter();
  const sessionUser = useSessionStore((s) => s.user);
  const localPhotoUri = useSessionStore((s) => s.localPhotoUri);
  const { data: routesData = [], isLoading, isError } = usePassangerRoutes();

  const nextRoute = getNextPassangerRoute(routesData);
  const visibleRoutes = routesData.filter((r) => r.membership_status !== 'rejected');
  const routeItems = visibleRoutes.map((route) => ({
    name: route.route_name,
    days: formatRecurrence(route.recurrence),
    duration: '30min',
    distance: '10 km',
    status: route.membership_status === 'pending' ? ('pending' as const) : ('default' as const),
    onPress:
      route.membership_status === 'accepted'
        ? () =>
            router.push({
              pathname: '/passenger-route-details-screen',
              params: { routeId: route.route_id },
            })
        : undefined,
  }));

  const handleProfilePress = () => {
    router.push('/profile-passenger-screen');
  };

  const handleSettingsPress = () => {
    router.push('/profile-passenger-screen');
  };

  const handleEnterCodePress = () => {
    router.push('/enter-route-code-screen');
  };

  const handleNextRoutePress = () => {
    if (!nextRoute) return;
    router.push({
      pathname: '/passenger-route-details-screen',
      params: { routeId: nextRoute.route_id },
    });
  };

  return (
    <AppScreenContainer
      backgroundColor={colors.white}
      edges={['top', 'bottom']}
      style={styles.container}
    >
      <View style={styles.headerSpacing}>
        <HomeHeaderCard
          name={sessionUser?.name ?? ''}
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
            <EmptyState icon="schedule" text="Carregando a próxima rota..." />
          ) : isError ? (
            <EmptyState
              icon="error-outline"
              text="Não foi possível carregar a próxima rota. Tente novamente em instantes."
            />
          ) : nextRoute ? (
            <NextRouteCard
              routeName={nextRoute.route_name}
              dateLabel={formatRecurrence(nextRoute.recurrence) || 'Próxima rota'}
              time={formatTime(nextRoute.expected_time)}
              onPress={handleNextRoutePress}
            />
          ) : (
            <View style={styles.emptyStateWrapper}>
              <EmptyState
                icon="calendar-today"
                text="Nenhuma rota agendada. Participe de uma rota para começar."
              />
            </View>
          )}
        </View>
      </View>

      <View style={styles.sectionWithTopSpacing}>
        <Text style={styles.sectionTitle}>Minhas Rotas</Text>

        <View style={styles.buttonContainer}>
          <ActionPillButton
            icon={<MaterialIcons name="qr-code-scanner" size={20} color={colors.dark} />}
            label="ENTRAR COM CÓDIGO"
            onPress={handleEnterCodePress}
            style={styles.enterCodeButton}
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
        ) : visibleRoutes.length > 0 ? (
          <RouteList
            routes={routeItems}
            style={styles.routesList}
            contentContainerStyle={styles.routesListContent}
          />
        ) : (
          <View style={styles.emptyStateWrapper}>
            <EmptyState
              icon="directions-car"
              text={
                'Você ainda não participa de nenhuma rota. Toque em "Entrar com Código" para começar.'
              }
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
  enterCodeButton: {
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
