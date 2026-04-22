import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import { InviteCodeDisplay } from '@/components/route/invite-code-display';
import { PrimaryButton } from '@/components/general/primary-button';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export default function ShareRouteCodeScreen() {
  const { inviteCode } = useLocalSearchParams<{ inviteCode: string }>();
  const routeCode = inviteCode ?? '-----';

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Junte-se à minha rota no VanGo! Use o código: ${routeCode}`,
      });

      if (result.action !== Share.dismissedAction) {
        router.push('/driver-home');
      }
    } catch {}
  };

  return (
    <AppScreenContainer style={styles.container}>
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="voltar"
        style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
      >
        <MaterialIcons name="arrow-back" size={24} color={colors.dark} />
      </Pressable>

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
    justifyContent: 'flex-start',
    paddingTop: 64,
    gap: 90,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    ...typography.header3,
    color: colors.dark,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.subtleText,
    textAlign: 'center',
  },
  button: {
    width: '100%',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    opacity: 0.6,
  },
});
