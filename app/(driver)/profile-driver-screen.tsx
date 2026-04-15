import { View, StyleSheet } from 'react-native';
import { CircleIconButton } from '@/components/general/circle-icon-button';
import { ProfileSummaryCard } from '@/components/profile/profile-summary-card';
import { ProfileMenuSection } from '@/components/profile/profile-menu-section';
import { colors } from '@/styles/colors';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { AuthHeader } from '@/components/auth/auth-header';

export default function ProfileDriverScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <AppScreenContainer backgroundColor={colors.accent} style={styles.container}>
      <View style={styles.topSection}>
        <CircleIconButton
          icon="arrow-back"
          onPress={() => router.back()}
          style={styles.backButton}
        />

        <View style={styles.titleWrapper}>
          <AuthHeader
            title="Perfil"
            subtitle="Gerencie suas informações e acompanhe sua atividade"
          />
        </View>
      </View>

      <View style={[styles.bottomSheet, { marginBottom: -(insets.bottom + 24) }]}>
        <ProfileSummaryCard />

        <View style={styles.divider} />

        <ProfileMenuSection
          variant="driver"
          onProfilePress={() => router.push('/edit-profile-screen')}
          onVehiclePress={() => router.push('/vehicle-details-screen')}
          // TODO: substituir por tela de metricas
          onReportsPress={() => router.push('/vehicle-details-screen')}
        />
      </View>
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  topSection: {
    position: 'relative',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 8,
    top: 12,
    zIndex: 10,
  },
  titleWrapper: {
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: colors.light,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // marginBottom é definido via inline style com -(insets.bottom + 24)
    paddingHorizontal: 55,
    paddingTop: 32,
  },
  divider: {
    height: 1,
    backgroundColor: colors.subtleText,
    marginVertical: 32,
  },
});
