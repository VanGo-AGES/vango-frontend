import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AppScreenContainer } from '@/components/general/app-screen-container';
import { PrimaryButton } from '@/components/general/primary-button';
import { RouteStepIndicator } from '@/components/route/route-step-indicator';
import AppDialog from '@/components/general/app-dialog';
import { ParticipantSelector } from '@/components/passenger/participant-selector';
import { colors, withAlpha } from '@/styles/colors';
import { typography } from '@/styles/typography';

export default function ParticipantSelectionScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code: string }>();

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

    router.push({
      pathname: '/(passenger)/passenger-address-screen' as any,
      params: { code, participantId: selectedId },
    });
  };

  return (
    <AppScreenContainer backgroundColor={colors.white}>
      <View style={styles.headerArea}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="voltar"
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.dark} />
        </Pressable>

        <Text style={styles.title}>Quem vai participar?</Text>
        <Text style={styles.subtitle}>Selecione quem utilizará essa rota.</Text>
      </View>

      <View style={styles.selectorContainer}>
        <ParticipantSelector options={options} selectedId={selectedId} onSelect={setSelectedId} />
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
  headerArea: {
    paddingTop: 8,
    paddingBottom: 24,
    alignItems: 'center',
  },

  backButton: {
    alignSelf: 'flex-start',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: withAlpha(colors.light, 0.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  backButtonPressed: {
    opacity: 0.65,
  },

  title: {
    ...typography.header3,
    color: colors.dark,
    textAlign: 'center',
  },

  subtitle: {
    ...typography.body,
    color: colors.dark,
    textAlign: 'center',
    marginTop: 4,
  },

  selectorContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 120,
  },

  bottomContent: {
    alignItems: 'center',
    gap: 32,
  },

  routeStepIndicatorWrapper: {
    alignSelf: 'center',
    marginBottom: -6,
    transform: [{ scale: 0.75 }],
  },

  continueButton: {
    alignSelf: 'center',
  },
});
