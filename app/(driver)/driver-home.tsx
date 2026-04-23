import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { HomeHeaderCard } from '@/components/route/home-header-card';
import { EmptyState } from '@/components/general/empty-state';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { ActionPillButton } from '@/components/route/action-pill-button';
import { useSessionStore } from '@/store/session.store';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { MaterialIcons } from '@expo/vector-icons';

type RouteItem = {
  id: string;
  name: string;
  time: string;
};

export default function DriverHomeScreen() {
  const router = useRouter();
  const sessionUser = useSessionStore((s) => s.user);
  const localPhotoUri = useSessionStore((s) => s.localPhotoUri);

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
            name={sessionUser?.name ?? ''}
            avatarUri={localPhotoUri ?? sessionUser?.photo_url ?? undefined}
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
                <ActionPillButton
                  onPress={handleCreateRoutePress}
                  label="Criar Rota"
                  icon={<MaterialIcons name="add" size={20} />}
                />
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
