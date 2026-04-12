import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppLogo } from '@/components/ui/app-logo';
import { AppScreenContainer } from '@/components/ui/app-screen-container';
import { BottomVersionInfo } from '@/components/ui/bottom-version-info';
import { colors } from '@/styles/colors';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

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
