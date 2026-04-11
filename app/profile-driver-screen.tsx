import { View, StyleSheet } from 'react-native';
import { SectionHeader } from '@/components/ui/section-header';
import { CircleIconButton } from '@/components/ui/circle-icon-button';
import { ProfileSummaryCard } from '@/components/ui/profile-summary-card';
import { ProfileMenuSection } from '@/components/profile/profile-menu-section';
import { colors } from '@/styles/colors';
import { useRouter } from 'expo-router';
import { AppScreenContainer } from '@/components/ui/app-screen-container';

export function ProfilePassengerScreen() {
  const router = useRouter();

  return (
    <AppScreenContainer style={styles.container}>
      <View style={styles.topSection}>
        <CircleIconButton
          icon="arrow-back"
          onPress={() => router.back()}
          style={styles.backButton}
        />

        <View style={styles.titleWrapper}>
          <SectionHeader
            title="Perfil"
            subtitle="Gerencie suas informações e acompanhe sua atividade"
          />
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <ProfileSummaryCard />

        <View style={styles.divider} />

        <ProfileMenuSection
          variant="driver"
          onProfilePress={() => router.push('/')}
          onVehiclePress={() => router.push('/')}
          onReportsPress={() => router.push('/')}
        />
      </View>
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.accent,
  },
  topSection: {
    position: 'relative',
    paddingTop: 60,
    paddingBottom: 40,
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
    marginHorizontal: -24,
    marginBottom: -60,
    paddingHorizontal: 55,
    paddingTop: 32,
  },
  divider: {
    height: 1,
    backgroundColor: colors.subtleText,
    marginVertical: 32,
  },
});
