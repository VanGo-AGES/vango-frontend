import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import SuccessShape from '@/assets/images/success-flower-shape.svg';
import { AuthHeader } from '@/components/ui/auth-header';
import { PrimaryButton } from '@/components/primary-button';
import { colors } from '@/styles/colors';

export default function RegisterSuccessScreen() {
  const router = useRouter();

  const handleEnter = () => {
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.innerContent}>
          <View style={styles.illustrationWrapper}>
            <SuccessShape width={160} height={160} />
            <MaterialIcons name="check" size={70} color={colors.primary} style={styles.icon} />
          </View>
          <AuthHeader title="Tudo certo!" subtitle="Seu cadastro foi realizado com sucesso :)" />
        </View>
      </View>

      <PrimaryButton
        label="Entrar"
        onPress={handleEnter}
        variant="secondary"
        style={styles.button}
        icon={<MaterialIcons name="arrow-forward" size={24} color={colors.light} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContent: {
    width: 255,
    alignItems: 'center',
    gap: 32,
  },
  illustrationWrapper: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shape: {
    width: '100%',
    height: '100%',
  },
  icon: {
    position: 'absolute',
  },
  button: {
    alignSelf: 'center',
  },
});
