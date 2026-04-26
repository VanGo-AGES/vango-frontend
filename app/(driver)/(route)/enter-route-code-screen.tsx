import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { AppScreenContainer } from '@/components/general/app-screen-container';
import { InviteCodeDisplay } from '@/components/route/invite-code-display';
import { RouteStepIndicator } from '@/components/route/route-step-indicator';
import { PrimaryButton } from '@/components/general/primary-button';
import AppDialog from '@/components/general/app-dialog';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export default function EnterRouteCodeScreen() {
  const [code, setCode] = useState<string | undefined>(undefined);
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);

  const handleCodeComplete = useCallback((completedCode: string | undefined) => {
    setCode(completedCode);
  }, []);

  const handleContinue = () => {
    if (!code) return;
    const isValid = false;
    if (isValid) {
      router.push({ pathname: '/(passenger)/route-details-screen' as any, params: { code } });
    } else {
      setErrorDialogVisible(true);
    }
  };

  return (
    <AppScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="voltar"
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.6 }]}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.dark} />
        </Pressable>
        <Text style={styles.title}>Código da Rota</Text>
        <Text style={styles.subtitle}>Digite o código para{'\n'}entrar em uma rota.</Text>
      </View>

      <View style={styles.middle}>
        <View style={styles.inputWrapper}>
          <InviteCodeDisplay length={5} editable onComplete={handleCodeComplete} />
        </View>
      </View>

      <View style={styles.bottom}>
        <View style={styles.stepWrapper}>
          <RouteStepIndicator currentStep={1} totalSteps={3} />
        </View>
        <PrimaryButton
          label="Continuar"
          onPress={handleContinue}
          disabled={!code}
          icon={<MaterialIcons name="arrow-forward" size={12} color={colors.primary} />}
          style={styles.button}
        />
      </View>

      <AppDialog
        visible={errorDialogVisible}
        title="Código Inválido"
        description="Por favor, insira um código válido"
        actions={[
          {
            label: 'Ok',
            onPress: () => {
              setErrorDialogVisible(false);
              setCode(undefined);
            },
            icon: 'check',
            variant: 'default',
          },
        ]}
        onRequestClose={() => setErrorDialogVisible(false)}
      />
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    gap: 8,
    paddingBottom: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
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
  middle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 120,
  },
  inputWrapper: {
    width: 360,
  },
  bottom: {
    width: '100%',
    alignItems: 'center',
    gap: 32,
  },
  stepWrapper: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    width: 152,
    height: 56,
    alignSelf: 'center',
  },
});
