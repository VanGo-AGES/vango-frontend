import { useState } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';

import { AppScreenContainer } from '@/components/general/app-screen-container';
import { AuthHeader } from '@/components/auth/auth-header';
import { CircleIconButton } from '@/components/general/circle-icon-button';
import { PrimaryButton } from '@/components/general/primary-button';
import { RouteStepIndicator } from '@/components/route/route-step-indicator';
import AppDialog from '@/components/general/app-dialog';
import { AddressFormSection } from '@/components/route/address-form-section';
import { colors } from '@/styles/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function PassengerAddressScreen() {
  const router = useRouter();

  const [address, setAddress] = useState({
    cep: '',
    numero: '',
    rua: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);

  const handleAddressChange = (field: keyof typeof address, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const { cep, numero, rua, bairro, cidade } = address;
    if (!cep || !numero || !rua || !bairro || !cidade) {
      setIsErrorDialogVisible(true);
      return;
    }
    router.push('/'); // navegar para a próxima etapa do fluxo
  };

  return (
    <AppScreenContainer backgroundColor={colors.light} style={styles.container}>
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

      <View style={styles.content}>
        <AddressFormSection title="" value={address} onChange={handleAddressChange} />
      </View>

      <View style={styles.footer}>
        <View style={styles.stepIndicatorContainer}>
          <RouteStepIndicator currentStep={3} totalSteps={3} />
        </View>

        <View style={styles.primaryButton}>
          <PrimaryButton
            label="Entrar"
            icon={<MaterialCommunityIcons name="check" size={20} color={colors.light} />}
            labelColor={colors.light}
            onPress={handleSubmit}
          />
        </View>
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
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 1,
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
    marginTop: 12,
    paddingHorizontal: 56,
  },
  footer: {
    alignItems: 'center',
    marginTop: 42,
  },
  stepIndicatorContainer: {
    alignItems: 'center',
    marginBottom: 42,
    transform: [{ scale: 0.8 }],
  },
  primaryButton: {},
});
