import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppLogo } from '@/components/ui/app-logo';
import { AppScreenContainer } from '@/components/ui/app-screen-container';
import { ProfileCard } from '@/components/ui/profile-card';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export default function RegisterProfileSelectionScreen() {
  const router = useRouter();

  const handleSelectDriver = () => {
    router.push({
      pathname: '/register-basic-info-screen',
      params: { userType: 'driver' },
    });
  };

  const handleSelectPassenger = () => {
    router.push({
      pathname: '/register-basic-info-screen',
      params: { userType: 'passenger' },
    });
  };

  const handleLoginPress = () => {
    // eslint-disable-next-line no-console
    console.log('entrou pro login');
  };

  return (
    <AppScreenContainer
      backgroundColor={colors.primary}
      style={styles.container}
      edges={['right', 'bottom', 'left']}
    >
      <View style={styles.topContent}>
        <AppLogo variant="dark" width={82} height={64} style={styles.logo} />

        <View style={styles.headerContainer}>
          <Text style={styles.title}>Escolha seu perfil</Text>
          <Text style={styles.subtitle}>Defina como você quer usar o app.</Text>
        </View>

        <View style={styles.cardsContainer}>
          <ProfileCard variant="motorista" onPress={handleSelectDriver} />
          <ProfileCard variant="passageiro" onPress={handleSelectPassenger} />
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Já tem uma conta? </Text>
          <Pressable onPress={handleLoginPress}>
            <Text style={styles.loginLink}>Login</Text>
          </Pressable>
        </View>
      </View>
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  topContent: {
    gap: 16,
    paddingTop: 32,
  },
  logo: {
    alignSelf: 'center',
    marginTop: 16,
  },
  headerContainer: {
    alignItems: 'center',
  },
  cardsContainer: {
    gap: 16,
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    ...typography.small,
    color: colors.dark,
  },
  loginLink: {
    ...typography.smallBold,
    color: colors.dark,
    textDecorationLine: 'underline',
  },
  title: {
    ...typography.header3,
    color: colors.dark,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.dark,
    textAlign: 'center',
    marginTop: 4,
  },
});
