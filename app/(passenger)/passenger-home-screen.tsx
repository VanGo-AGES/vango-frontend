import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActionPillButton } from '@/components/route/action-pill-button';
import { EmptyState } from '@/components/general/empty-state';
import { HomeHeaderCard } from '@/components/route/home-header-card';
import { NextRouteCard } from '@/components/route/next-route-card';
import { RouteList } from '@/components/route/route-list';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { MaterialIcons } from '@expo/vector-icons';

type NextRoute = {
  routeName: string;
  dateLabel: string;
  time: string;
};

// Dados mockados para visualização — serão substituídos por dados reais da API
const MOCK_USER = {
  name: 'Mateus Cunha',
  location: 'Porto Alegre, RS',
};

const MOCK_NEXT_ROUTE: NextRoute | null = {
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
  const hasPendingRoutes = MOCK_ROUTES.some((r) => r.status === 'pending');
  const nextRoute = MOCK_NEXT_ROUTE;

  return (
    <AppScreenContainer backgroundColor={colors.light} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header com avatar, nome e botão de settings */}
        <HomeHeaderCard
          name={MOCK_USER.name}
          location={MOCK_USER.location}
          onSettingsPress={() => {}}
          onProfilePress={() => {}}
        />

        {/* Seção: Próxima Rota */}
        <Text style={styles.sectionTitle}>Próxima Rota</Text>

        {nextRoute ? (
          <>
            <NextRouteCard
              routeName={nextRoute.routeName}
              dateLabel={nextRoute.dateLabel}
              time={nextRoute.time}
              onPress={() => {}}
            />
          </>
        ) : (
          <EmptyState
            icon="calendar-today"
            text={'Nenhuma rota agendada\nParticipe de uma rota para começar.'}
          />
        )}

        {/* Seção: Minhas Rotas */}
        <Text style={styles.sectionTitle}>Minhas Rotas</Text>

        <ActionPillButton
          icon={<MaterialIcons name="qr-code-scanner" size={20} color={colors.dark} />}
          label="ENTRAR COM CÓDIGO"
          onPress={() => {}}
        />

        {hasRoutes ? (
          <RouteList
            routes={MOCK_ROUTES.map((r) => ({
              name: r.name,
              days: r.days,
              duration: r.duration,
              distance: r.distance,
              status: r.status,
            }))}
          />
        ) : (
          <EmptyState
            icon="directions-car"
            text={
              'Você ainda não participa de nenhuma rota.\nToque em "Entrar com Código" para começar.'
            }
          />
        )}
      </ScrollView>
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    gap: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    ...typography.header3,
    color: colors.dark,
    marginTop: 8,
  },
  verRota: {
    ...typography.body,
    color: colors.primary,
    textAlign: 'right',
  },
});
