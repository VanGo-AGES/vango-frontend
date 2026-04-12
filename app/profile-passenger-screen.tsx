import { View, StyleSheet } from 'react-native';
import { CircleIconButton } from '@/components/ui/circle-icon-button';
import { ProfileSummaryCard } from '@/components/ui/profile-summary-card';
import { ProfileMenuSection } from '@/components/profile/profile-menu-section';
import { colors } from '@/styles/colors';
import { useRouter } from 'expo-router';
import { AppScreenContainer } from '@/components/ui/app-screen-container';
import { AuthHeader } from '@/components/ui/auth-header';

export default function ProfilePassengerScreen() {
  const router = useRouter();

  return (
    <AppScreenContainer backgroundColor={colors.accent} style={styles.container}>
      <View style={styles.topSection}>
        <CircleIconButton
          icon="arrow-back"
          onPress={() => router.back()}
          style={styles.backButton}
        />

        <View style={styles.titleWrapper}>
          <AuthHeader title="Perfil" subtitle="Gerencie suas informações e personalize sua conta" />
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <ProfileSummaryCard />

        <View style={styles.divider} />

        <ProfileMenuSection
          variant="passenger"
          onProfilePress={() => router.push('/')}
          onPersonalDataPress={() => router.push('/')}
          onDependentsPress={() => router.push('/')}
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
