import { StyleSheet, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import SuccessShape from '@/assets/images/success-flower-shape.svg';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { PrimaryButton } from '@/components/general/primary-button';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export default function RegisterSuccessScreen() {
  const router = useRouter();
  const { userType } = useLocalSearchParams<{ userType?: string }>();

  const handleEnter = () => {
    if (userType === 'driver') {
      router.replace('/driver-home');
    } else {
      router.replace('/passenger-home-screen');
    }
  };

  return (
    <AppScreenContainer style={styles.container}>
      <View style={styles.content}>
        <View style={styles.innerContent}>
          <View style={styles.illustrationWrapper}>
            <SuccessShape width={160} height={160} />
            <MaterialIcons name="check" size={70} color={colors.primary} style={styles.icon} />
          </View>

          <View style={styles.textBlock}>
            <Text style={styles.title}>Tudo certo!</Text>
            <Text style={styles.subtitle}>Seu cadastro foi realizado com sucesso :)</Text>
          </View>
        </View>
      </View>

      <PrimaryButton
        label="Entrar"
        onPress={handleEnter}
        variant="secondary"
        style={styles.button}
        icon={<MaterialIcons name="arrow-forward" size={24} color={colors.light} />}
      />
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContent: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    gap: 32,
  },
  illustrationWrapper: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
  },
  textBlock: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    ...typography.header2,
    color: colors.dark,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.dark,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'center',
  },
});
