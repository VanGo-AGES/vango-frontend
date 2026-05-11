import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppLogo } from '@/components/general/app-logo';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { BottomVersionInfo } from '@/components/general/bottom-version-info';
import { useSessionStore } from '@/store/session.store';
import { colors } from '@/styles/colors';

export default function SplashScreen() {
  const router = useRouter();
  const user = useSessionStore((s) => s.user);
  const hasHydrated = useSessionStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;

    const timer = setTimeout(() => {
      if (user) {
        const destination = user.role === 'driver' ? '/driver-home' : '/passenger-home-screen';
        router.replace(destination as never);
      } else {
        router.replace('/onboarding');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasHydrated, user, router]);

  return (
    <AppScreenContainer backgroundColor={colors.dark} style={styles.container}>
      <View style={styles.logoWrapper}>
        <AppLogo variant="light" width={180} height={180} />
      </View>

      <BottomVersionInfo theme="dark" brandName="VanGO" />
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  logoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
