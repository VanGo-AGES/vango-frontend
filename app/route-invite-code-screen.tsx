import { Share, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { InviteCodeDisplay } from '@/components/invite-code-display';
import { PrimaryButton } from '@/components/primary-button';
import { AppScreenContainer } from '@/components/ui/app-screen-container';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export default function ShareRouteCodeScreen() {
  // TODO: Substituir por dado real do backend
  const routeCode = '1A6BF';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Junte-se à minha rota no VanGo! Use o código: ${routeCode}`,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao compartilhar o código da rota:', error);
    }
  };

  return (
    <AppScreenContainer style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Código da Rota</Text>
          <Text style={styles.subtitle}>
            Use este código para convidar passageiros para sua rota.
          </Text>
        </View>

        <InviteCodeDisplay length={5} code={routeCode} editable={false} />
      </View>

      <PrimaryButton
        label="Compartilhar"
        onPress={handleShare}
        variant="secondary"
        icon={<Feather name="upload" size={20} color={colors.light} />}
        style={styles.button}
      />
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 48,
  },
  header: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  title: {
    ...typography.header3,
    color: colors.dark,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.subtleText,
    textAlign: 'center',
  },
  button: {
    width: '100%',
  },
});
