import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { AppScreenContainer } from '@/components/general/app-screen-container';
import { AuthHeader } from '@/components/auth/auth-header';
import { InviteCodeDisplay } from '@/components/route/invite-code-display';
import { RouteStepIndicator } from '@/components/route/route-step-indicator';
import { PrimaryButton } from '@/components/general/primary-button';
import AppDialog from '@/components/general/app-dialog';
import { useRouteInvite } from '@/hooks/use-route-invite';
import { colors } from '@/styles/colors';

export default function EnterRouteCodeScreen() {
  const [code, setCode] = useState('');
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);

  const { routeSummary, isLoading, isInvalidCode } = useRouteInvite(code);

  const handleCodeComplete = useCallback((completedCode: string | undefined) => {
    setCode(completedCode ?? '');
  }, []);

  useEffect(() => {
    if (isInvalidCode) {
      setErrorDialogVisible(true);
    }
  }, [isInvalidCode]);

  const handleContinue = () => {
    if (!routeSummary) return;

    router.push({
      pathname: '/(passenger)/participant-selection-screen' as any,
      params: {
        code,
        routeId: routeSummary.id,
        recurrence: routeSummary.recurrence,
      },
    });
  };

  return (
    <AppScreenContainer backgroundColor={colors.white} style={styles.container}>
      <AuthHeader
        title="Código da Rota"
        subtitle="Digite o código para entrar em uma rota."
        showBackButton
      />

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
          disabled={!routeSummary || isLoading}
          labelColor={colors.white}
          icon={<MaterialIcons name="arrow-forward" size={18} color={colors.white} />}
          style={styles.button}
        />
      </View>

      <AppDialog
        visible={errorDialogVisible}
        title="Código Inválido"
        description="Código Inválido — Por favor, insira um código válido."
        actions={[
          {
            label: 'Ok',
            onPress: () => {
              setErrorDialogVisible(false);
              setCode('');
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
