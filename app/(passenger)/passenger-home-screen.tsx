import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
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
// TODO: Remover estes mocks quando o backend enviar as coordenadas
const MOCK_ORIGIN = { latitude: -30.0277, longitude: -51.1632 }; // Shopping Iguatemi
const MOCK_DESTINATION = { latitude: -30.0495, longitude: -51.2287 }; // Shopping Praia de Belas

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
  const { data: routesData = [], isLoading, isError, refetch } = usePassangerRoutes();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const nextRoute = getNextPassangerRoute(routesData);
  const visibleRoutes = routesData.filter((r) => r.membership_status !== 'rejected');

  // Rota em andamento abre direto a tela de viagem ativa (detalhes ativos).
  // A tela de detalhes "normal" é só para rotas que NÃO estão em andamento.
  const goToRoute = (routeId: string, status?: string) => {
    const pathname =
      status === 'em_andamento'
        ? '/passenger-active-route-details-screen'
        : '/passenger-route-details-screen';
    router.push({ pathname: pathname as never, params: { routeId } });
  };

  const routeItems = visibleRoutes.map((route) => ({
    id: route.route_id,
    name: route.route_name,
    days: formatRecurrence(route.recurrence),
    duration: '30min',
    distance: '10 km',
    status: route.membership_status === 'pending' ? ('pending' as const) : ('default' as const),

    // <-- AJUSTE AQUI: Lendo os campos 'achatados' direto da raiz
    origin:
      route.origin_latitude && route.origin_longitude
        ? {
            latitude: Number(route.origin_latitude),
            longitude: Number(route.origin_longitude),
          }
        : MOCK_ORIGIN,
    destination:
      route.destination_latitude && route.destination_longitude
        ? {
            latitude: Number(route.destination_latitude),
            longitude: Number(route.destination_longitude),
          }
        : MOCK_DESTINATION,

    onPress:
      route.membership_status === 'accepted'
        ? () => goToRoute(route.route_id, route.status)
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
    goToRoute(nextRoute.route_id, nextRoute.status);
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
              origin={
                nextRoute.origin_latitude && nextRoute.origin_longitude
                  ? {
                      latitude: Number(nextRoute.origin_latitude),
                      longitude: Number(nextRoute.origin_longitude),
                    }
                  : MOCK_ORIGIN
              }
              destination={
                nextRoute.destination_latitude && nextRoute.destination_longitude
                  ? {
                      latitude: Number(nextRoute.destination_latitude),
                      longitude: Number(nextRoute.destination_longitude),
                    }
                  : MOCK_DESTINATION
              }
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
