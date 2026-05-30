import { BottomVersionInfo } from '@/components/general/bottom-version-info';
import { StyleSheet, View, Text } from 'react-native';
import OfflineIllustration from '@/assets/images/offline-illustration.svg';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OfflineScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <OfflineIllustration width={160} height={160} />

        <Text style={styles.title}>Você está offline</Text>
        <Text style={styles.subtitle}>Conecte-se à internet{'\n'}para continuar!</Text>
      </View>
      <BottomVersionInfo theme="dark" style={styles.footer} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.header2,
    color: colors.primary,
    marginTop: 64,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.primary,
    textAlign: 'center',
    marginTop: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});
