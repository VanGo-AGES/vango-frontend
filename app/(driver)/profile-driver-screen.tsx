import { ScrollView, StyleSheet, View } from 'react-native';
import { CircleIconButton } from '@/components/general/circle-icon-button';
import { ProfileSummaryCard } from '@/components/profile/profile-summary-card';
import { ProfileMenuSection } from '@/components/profile/profile-menu-section';
import { colors, withAlpha } from '@/styles/colors';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { AuthHeader } from '@/components/auth/auth-header';
import { PrimaryButton } from '@/components/general/primary-button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAccountActions } from '@/hooks/use-account-actions';

export default function ProfileDriverScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { handleLogout, handleDeleteAccount } = useAccountActions();

  return (
    <AppScreenContainer
      backgroundColor={colors.accent}
      style={styles.container}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.topSection}>
        <CircleIconButton
          icon="arrow-back"
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="voltar"
        />

        <View style={styles.titleWrapper}>
          <AuthHeader
            title="Perfil"
            subtitle="Gerencie suas informações e acompanhe sua atividade"
          />
        </View>
      </View>

      <ScrollView
        style={styles.bottomSheet}
        contentContainerStyle={[styles.bottomSheetContent, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <ProfileSummaryCard />

        <View style={styles.divider} />

        <ProfileMenuSection
          variant="driver"
          onProfilePress={() => router.push('/edit-profile-screen')}
          onVehiclePress={() => router.push('/vehicle-details-screen')}
          // TODO: substituir por tela de metricas
          onReportsPress={() => router.push('/vehicle-details-screen')}
        />

        <View style={styles.actionButtonsContainer}>
          <PrimaryButton
            label="Excluir Conta"
            onPress={handleDeleteAccount}
            variant="warning"
            labelColor={colors.white}
            icon={<MaterialIcons name="delete-outline" size={20} color={colors.white} />}
            style={styles.deleteButton}
          />

          <PrimaryButton
            label="Sair"
            onPress={handleLogout}
            variant="primary"
            labelColor={colors.light}
            icon={<MaterialIcons name="keyboard-return" size={20} color={colors.light} />}
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
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
    left: 24,
    top: 12,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: withAlpha(colors.light, 0.65),
    borderWidth: 0,
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
  },
  bottomSheetContent: {
    flexGrow: 1,
    paddingHorizontal: 55,
    paddingTop: 32,
  },
  divider: {
    height: 1,
    backgroundColor: colors.subtleText,
    marginVertical: 32,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 'auto',
    paddingTop: 32,
  },
  deleteButton: {
    minWidth: 144,
  },
  logoutButton: {
    minWidth: 85,
  },
});
