import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AppScreenContainer } from '@/components/general/app-screen-container';
import { AuthHeader } from '@/components/auth/auth-header';
import { PrimaryButton } from '@/components/general/primary-button';
import { RouteStepIndicator } from '@/components/route/route-step-indicator';
import AppDialog from '@/components/general/app-dialog';
import { ParticipantSelector } from '@/components/passenger/participant-selector';
import { colors } from '@/styles/colors';

export default function ParticipantSelectionScreen() {
  const router = useRouter();

  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [showError, setShowError] = useState(false);

  const options = [
    { id: 'you', label: 'Você' },
    { id: '1', label: 'Valentina Fonseca' },
    { id: '2', label: 'Luiz Fonseca' },
  ];

  const handleContinue = () => {
    if (!selectedId) {
      setShowError(true);
      return;
    }

    router.push('/exemplo');
  };

  return (
    <AppScreenContainer>
      <AuthHeader
        title="Quem vai participar?"
        subtitle="Selecione quem utilizará essa rota."
        showBackButton
      />

      <View style={styles.selectorContainer}>
        <ParticipantSelector
          options={options}
          selectedId={selectedId}
          onSelect={setSelectedId}
          dependentsPaddingEnd={16}
        />
      </View>

      <View style={styles.bottomContent}>
        <View style={styles.routeStepIndicatorWrapper}>
          <RouteStepIndicator currentStep={2} totalSteps={3} />
        </View>

        <PrimaryButton
          label="Continuar"
          onPress={handleContinue}
          variant="secondary"
          icon={<MaterialCommunityIcons name="check" size={20} color={colors.light} />}
          style={styles.continueButton}
        />
      </View>

      <AppDialog
        visible={showError}
        title="Campo obrigatório"
        description="Selecione quem vai participar para continuar."
        actions={[
          {
            label: 'Ok',
            onPress: () => setShowError(false),
            icon: 'check',
          },
        ]}
        onRequestClose={() => setShowError(false)}
      />
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  selectorContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  bottomContent: {
    alignItems: 'center',
    paddingTop: 36,
    gap: 32,
  },

  routeStepIndicatorWrapper: {
    alignSelf: 'center',
    marginBottom: -6,
    transform: [{ scale: 0.75 }],
  },

  continueButton: {
    alignSelf: 'center',
    marginBottom: 24,
  },
});
