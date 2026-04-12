import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { HomeHeaderCard } from '@/components/home-header-card';
import { EmptyState } from '@/components/empty-state';
import { AppScreenContainer } from '@/components/ui/app-screen-container';
import { CreateRouteButton } from '@/components/ui/create-route-button';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

type RouteItem = {
  id: string;
  name: string;
  time: string;
};

export default function DriverHomeScreen() {
  const router = useRouter();

  let nextRoute: RouteItem | null = null;
  let myRoutes: RouteItem[] = [];

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
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.headerSpacing, styles.horizontalPadding]}>
          <HomeHeaderCard
            name="João Silva"
            location="Porto Alegre, RS"
            onProfilePress={handleProfilePress}
            onSettingsPress={handleSettingsPress}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.horizontalPadding]}>Próxima rota</Text>

          <View style={styles.fullWidthLightSection}>
            <View style={styles.innerContent}>
              {nextRoute ? (
                <View style={styles.routeCard}>
                  {/* Replace with nextRoute.name & nextRoute.time */}
                  <Text style={styles.routeTitle}>{''}</Text>
                  <Text style={styles.routeSubtitle}>{''}</Text>
                </View>
              ) : (
                <EmptyState
                  icon="event"
                  text="Nenhuma rota agendada. Crie uma rota para começar a organizar seus trajetos."
                />
              )}
            </View>
          </View>
        </View>

        <View style={styles.sectionWithTopSpacing}>
          <View style={styles.fullWidthLightSection}>
            <View style={styles.innerContent}>
              <Text style={styles.sectionTitle}>Minhas rotas</Text>

              <View style={styles.buttonContainer}>
                <CreateRouteButton onPress={handleCreateRoutePress} />
              </View>

              {myRoutes.length > 0 ? (
                myRoutes.map((route) => (
                  <View key={route.id} style={styles.routeCard}>
                    <Text style={styles.routeTitle}>{route.name}</Text>
                    <Text style={styles.routeSubtitle}>{route.time}</Text>
                  </View>
                ))
              ) : (
                <EmptyState
                  icon="directions-car"
                  text="Você ainda não criou nenhuma rota. Toque em 'Criar rota' para começar."
                />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
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
  horizontalPadding: {
    paddingHorizontal: 24,
  },
  headerSpacing: {
    marginBottom: 32,
  },
  section: {
    gap: 4,
  },
  sectionWithTopSpacing: {
    gap: 12,
    marginTop: 32,
  },
  fullWidthLightSection: {
    backgroundColor: colors.light,
    paddingVertical: 16,
  },
  innerContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  sectionTitle: {
    ...typography.body,
    color: colors.dark,
  },
  routeCard: {
    padding: 16,
    borderRadius: 12,
  },
  routeTitle: {
    ...typography.body,
    color: colors.dark,
  },
  routeSubtitle: {
    ...typography.caption,
    color: colors.subtleText,
  },
  buttonContainer: {
    width: '90%',
    height: 56,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  createRouteText: {
    ...typography.caption,
    color: colors.subtleText,
    textAlign: 'center',
  },
});
