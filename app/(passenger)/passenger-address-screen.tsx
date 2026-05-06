import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppScreenContainer } from '@/components/general/app-screen-container';
import { AuthHeader } from '@/components/auth/auth-header';
import { CircleIconButton } from '@/components/general/circle-icon-button';
import { PrimaryButton } from '@/components/general/primary-button';
import { RouteStepIndicator } from '@/components/route/route-step-indicator';
import AppDialog from '@/components/general/app-dialog';
import { AddressFormSection } from '@/components/route/address-form-section';
import { useJoinRoute } from '@/hooks/use-join-route';
import { ApiError } from '@/services/api';
import { colors } from '@/styles/colors';
import type { AddressErrors, RouteFormAddress } from '@/types/route.types';

const DAY_MAP: Record<string, string> = {
  seg: 'monday',
  ter: 'tuesday',
  qua: 'wednesday',
  qui: 'thursday',
  sex: 'friday',
  sab: 'saturday',
  dom: 'sunday',
};

function buildSchedules(recurrence: string): { day_of_week: string }[] {
  return recurrence
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter((d) => DAY_MAP[d] !== undefined)
    .map((d) => ({ day_of_week: DAY_MAP[d] }));
}

export default function PassengerAddressScreen() {
  const { routeId, recurrence, participantId } = useLocalSearchParams<{
    routeId: string;
    recurrence: string;
    participantId: string;
  }>();

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
  const [errorDialogTitle, setErrorDialogTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessDialogVisible, setIsSuccessDialogVisible] = useState(false);

  const joinRoute = useJoinRoute(routeId ?? '');

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

  const handleSubmit = async () => {
    if (!validateForm()) {
      setErrorDialogTitle('Campo obrigatório');
      setErrorMessage('Preencha seu endereço para continuar.');
      setIsErrorDialogVisible(true);
      return;
    }

    const payload = {
      dependent_id: participantId === 'you' ? null : (participantId ?? null),
      address: {
        label: 'Casa',
        street: address.rua,
        number: address.numero,
        neighborhood: address.bairro,
        zip: address.cep.replace(/\D/g, '').replace(/^(\d{5})(\d{3})$/, '$1-$2'),
        city: address.cidade,
        state: address.estado,
      },
      schedules: buildSchedules(recurrence ?? ''),
    };

    try {
      await joinRoute.mutateAsync(payload);
      setIsSuccessDialogVisible(true);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setErrorDialogTitle('Não foi possível entrar na rota');
        setErrorMessage('Esta rota está lotada ou você já participa dela.');
      } else {
        setErrorDialogTitle('Erro');
        setErrorMessage('Ocorreu um erro ao enviar sua solicitação. Tente novamente.');
      }
      setIsErrorDialogVisible(true);
    }
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
          disabled={joinRoute.isPending}
          style={styles.submitButton}
        />
      </View>

      <AppDialog
        visible={isErrorDialogVisible}
        title={errorDialogTitle}
        description={errorMessage}
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
