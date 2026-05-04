import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppScreenContainer } from '@/components/general/app-screen-container';
import { AuthHeader } from '@/components/auth/auth-header';
import { CircleIconButton } from '@/components/general/circle-icon-button';
import { PrimaryButton } from '@/components/general/primary-button';
import { RouteStepIndicator } from '@/components/route/route-step-indicator';
import AppDialog from '@/components/general/app-dialog';
import { AddressFormSection } from '@/components/route/address-form-section';
import { colors } from '@/styles/colors';
import type { AddressErrors, RouteFormAddress } from '@/types/route.types';

export default function PassengerAddressScreen() {
  useLocalSearchParams<{ code: string; participantId: string }>();

  const [address, setAddress] = useState<RouteFormAddress>({
    cep: '',
    numero: '',
    rua: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  const [errors, setErrors] = useState<AddressErrors>({});
  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);
  const [isSuccessDialogVisible, setIsSuccessDialogVisible] = useState(false);

  const handleAddressChange = (field: keyof RouteFormAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const nextErrors: AddressErrors = {};
    const requiredFields: (keyof RouteFormAddress)[] = ['cep', 'numero', 'rua', 'bairro', 'cidade'];

    requiredFields.forEach((field) => {
      if (!address[field].trim()) {
        nextErrors[field] = 'Este campo é obrigatório.';
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      setIsErrorDialogVisible(true);
      return;
    }
    setIsSuccessDialogVisible(true);
  };

  return (
    <AppScreenContainer
      backgroundColor={colors.light}
      style={styles.container}
      disableKeyboardDismiss
    >
      <View style={styles.topSection}>
        <CircleIconButton
          icon="arrow-back"
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="voltar"
        />

        <View style={styles.titleWrapper}>
          <AuthHeader title="Seu endereço" subtitle="Informe o local da sua parada na rota." />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <AddressFormSection
          title=""
          value={address}
          onChange={handleAddressChange}
          errors={errors}
        />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.stepIndicatorContainer}>
          <RouteStepIndicator currentStep={3} totalSteps={3} />
        </View>

        <PrimaryButton
          label="Entrar"
          icon={<MaterialIcons name="check" size={20} color={colors.light} />}
          labelColor={colors.light}
          onPress={handleSubmit}
          style={styles.submitButton}
        />
      </View>

      <AppDialog
        visible={isErrorDialogVisible}
        title="Campo obrigatório"
        description="Preencha seu endereço para continuar."
        onRequestClose={() => setIsErrorDialogVisible(false)}
        actions={[
          {
            label: 'Ok',
            icon: 'check',
            onPress: () => setIsErrorDialogVisible(false),
          },
        ]}
      />

      <AppDialog
        visible={isSuccessDialogVisible}
        title="Solicitação enviada!"
        description="Aguarde a aprovação do motorista."
        onRequestClose={() => {}}
        actions={[
          {
            label: 'Ok',
            icon: 'check',
            onPress: () => {
              setIsSuccessDialogVisible(false);
              router.navigate('/(passenger)/passenger-home-screen' as any);
            },
          },
        ]}
      />
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  topSection: {
    position: 'relative',
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 24,
    top: 12,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(250, 252, 254, 0.65)',
    borderWidth: 0,
  },
  titleWrapper: {
    maxWidth: 200,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 56,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  footer: {
    alignItems: 'center',
    marginTop: 42,
    gap: 32,
  },
  stepIndicatorContainer: {
    transform: [{ scale: 0.8 }],
  },
  submitButton: {
    alignSelf: 'center',
  },
});
