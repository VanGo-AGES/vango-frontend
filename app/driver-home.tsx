import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeHeaderCard } from '@/components/home-header-card';
import { EmptyState } from '@/components/empty-state';
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

  const nextRoute: RouteItem | null = null;
  const myRoutes: RouteItem[] = [];

  // Substituir por rota para o perfil do motorista.
  const handleProfilePress = () => {
    router.push('/exemplo');
  };

  // Substituir por rota para config do motorista.
  const handleSettingsPress = () => {
    router.push('/exemplo');
  };

  // Substituir por rota para criar rota.
  const handleCreateRoutePress = () => {
    router.push('/exemplo');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSpacing}>
          <HomeHeaderCard
            name="João Silva"
            location="Porto Alegre, RS"
            onProfilePress={handleProfilePress}
            onSettingsPress={handleSettingsPress}
          />
        </View>

        <View style={styles.nextRouteSection}>
          <Text style={styles.sectionTitle}>Próxima rota</Text>

          {nextRoute ? (
            <View style={styles.routeCard}>
              <Text style={styles.routeTitle}>{nextRoute.name}</Text>
              <Text style={styles.routeSubtitle}>{nextRoute.time}</Text>
            </View>
          ) : (
            <EmptyState
              icon="event"
              text="Nenhuma rota agendada. Crie uma rota para começar a organizar seus trajetos."
            />
          )}
        </View>

        <View style={styles.myRoutesSection}>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light,
  },
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  headerSpacing: {
    marginTop: 15,
    marginBottom: 25,
  },
  nextRouteSection: {
    gap: 12,
  },
  myRoutesSection: {
    gap: 12,
    marginTop: 32,
  },
  sectionTitle: {
    ...typography.body,
    color: colors.dark,
    height: 48,
  },
  routeCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.light,
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
    marginTop: 8,
    width: '90%',
    height: 56,
    alignSelf: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createRouteText: {
    ...typography.caption,
    color: colors.subtleText,
    textAlign: 'center',
  },
});
