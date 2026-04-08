import { StyleSheet, View } from 'react-native';

import { AppLogo } from '@/components/ui/app-logo';
import { AppScreenContainer } from '@/components/ui/app-screen-container';
import { BottomVersionInfo } from '@/components/ui/bottom-version-info';
import { colors } from '@/styles/colors';

// const SPLASH_DELAY_MS = 0;
// When the auth flow is ready, use this delay before navigating away from this screen.

export default function SplashScreen() {
  return (
    <AppScreenContainer backgroundColor={colors.dark} style={styles.container}>
      <View style={styles.logoWrapper}>
        <AppLogo variant="light" width={180} height={180} />
      </View>

      <BottomVersionInfo theme="dark" style={styles.bottomInfo} brandName="VanGO" />
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
  bottomInfo: {
    paddingBottom: 4,
  },
});
