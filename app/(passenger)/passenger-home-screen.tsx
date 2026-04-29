import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ActionPillButton } from '@/components/route/action-pill-button';
import { EmptyState } from '@/components/general/empty-state';
import { HomeHeaderCard } from '@/components/route/home-header-card';
import { NextRouteCard } from '@/components/route/next-route-card';
import { RouteList } from '@/components/route/route-list';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

const MOCK_USER = {
  name: 'Mateus Cunha',
  location: 'Porto Alegre, RS',
};

const MOCK_NEXT_ROUTE = {
  routeName: 'PUCRS',
  dateLabel: 'Hoje',
  time: '08:00',
};

const MOCK_ROUTES = [
  {
    name: 'PUCRS',
    days: 'Seg · Qua · Sex',
    duration: '23 min',
    distance: '9.2 km',
    status: 'pending' as const,
  },
];

export default function PassengerHomeScreen() {
  const hasRoutes = MOCK_ROUTES.length > 0;
  const nextRoute = MOCK_NEXT_ROUTE;

  return (
    <AppScreenContainer
      backgroundColor={colors.white}
      edges={['top', 'bottom']}
      style={styles.container}
    >
      <View style={styles.headerSpacing}>
        <HomeHeaderCard
          name={MOCK_USER.name}
          location={MOCK_USER.location}
          onSettingsPress={() => {}}
          onProfilePress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próxima Rota</Text>

        <View style={styles.panel}>
          {nextRoute ? (
            <NextRouteCard
              routeName={nextRoute.routeName}
              dateLabel={nextRoute.dateLabel}
              time={nextRoute.time}
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
            onPress={() => {}}
            style={styles.enterCodeButton}
          />
        </View>

        {hasRoutes ? (
          <RouteList
            routes={MOCK_ROUTES}
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
    paddingHorizontal: 24,
  },
  routesListContent: {
    gap: 16,
  },
});
