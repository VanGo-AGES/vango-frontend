import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import AppDialog from '@/components/general/app-dialog';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { PrimaryButton } from '@/components/general/primary-button';
import { AddressFormSection } from '@/components/route/address-form-section';
import { AppTextField } from '@/components/general/app-text-field';
import { RecurrenceSelector } from '@/components/route/recurrence-selector';
import { RouteTypeSelectField, type RouteType } from '@/components/route/route-type-select-field';
import { SectionHeader } from '@/components/route/section-header';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import type { AddressErrors, RouteFormAddress } from '@/types/route.types';

// Dados mockados — substituir por dados reais via props/params quando a API estiver pronta
const MOCK_ROUTE = {
  name: 'PUCRS',
  routeType: 'Ida' as RouteType,
  origin: {
    cep: '90619-900',
    numero: '6681',
    rua: 'Av. Ipiranga',
    bairro: '',
    cidade: '',
    estado: '',
  },
  destination: {
    cep: '90619-900',
    numero: '6681',
    rua: 'Av. Ipiranga',
    bairro: 'Partenon',
    cidade: 'Porto Alegre',
    estado: 'RS',
  },
  arrivalTime: '09:30',
  selectedDays: ['Seg', 'Ter', 'Qua'],
};

export default function EditRouteScreen() {
  const [name, setName] = useState(MOCK_ROUTE.name);
  const [routeType, setRouteType] = useState<RouteType>(MOCK_ROUTE.routeType);
  const [origin, setOrigin] = useState<RouteFormAddress>(MOCK_ROUTE.origin);
  const [destination, setDestination] = useState<RouteFormAddress>(MOCK_ROUTE.destination);
  const [arrivalTime, setArrivalTime] = useState(MOCK_ROUTE.arrivalTime);
  const [selectedDays, setSelectedDays] = useState<string[]>(MOCK_ROUTE.selectedDays);

  const [originErrors, setOriginErrors] = useState<AddressErrors>({});
  const [destinationErrors, setDestinationErrors] = useState<AddressErrors>({});
  const [nameError, setNameError] = useState<string | undefined>();
  const [routeTypeError, setRouteTypeError] = useState<string | undefined>();
  const [arrivalTimeError, setArrivalTimeError] = useState<string | undefined>();
  const [recurrenceError, setRecurrenceError] = useState<string | undefined>();

  const [successDialogVisible, setSuccessDialogVisible] = useState(false);

  const validateForm = (): boolean => {
    let valid = true;

    if (!name.trim()) {
      setNameError('Este campo é obrigatório.');
      valid = false;
    } else {
      setNameError(undefined);
    }

    if (!routeType) {
      setRouteTypeError('Selecione o tipo de rota.');
      valid = false;
    } else {
      setRouteTypeError(undefined);
    }

    if (!arrivalTime.trim()) {
      setArrivalTimeError('Este campo é obrigatório.');
      valid = false;
    } else {
      setArrivalTimeError(undefined);
    }

    if (selectedDays.length === 0) {
      setRecurrenceError('Pelo menos um dia deve ser selecionado.');
      valid = false;
    } else {
      setRecurrenceError(undefined);
    }

    const requiredFields: (keyof RouteFormAddress)[] = ['cep', 'numero', 'rua', 'bairro', 'cidade'];

    const nextOriginErrors: AddressErrors = {};
    requiredFields.forEach((field) => {
      if (!origin[field].trim()) nextOriginErrors[field] = 'Este campo é obrigatório.';
    });
    setOriginErrors(nextOriginErrors);
    if (Object.keys(nextOriginErrors).length > 0) valid = false;

    const nextDestinationErrors: AddressErrors = {};
    requiredFields.forEach((field) => {
      if (!destination[field].trim()) nextDestinationErrors[field] = 'Este campo é obrigatório.';
    });
    setDestinationErrors(nextDestinationErrors);
    if (Object.keys(nextDestinationErrors).length > 0) valid = false;

    return valid;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    setSuccessDialogVisible(true);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <AppScreenContainer
        backgroundColor={colors.accent}
        edges={['top', 'left', 'right']}
        style={styles.container}
      >
        {/* Header fixo */}
        <SectionHeader
          title="Editar Rota"
          subtitle={'Atualize as informações\nda sua rota.'}
          showBackButton
        />

        {/* Card scrollável */}
        <View style={styles.card}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {/* Informações básicas */}
            <SectionHeader title="Informações" />

            <AppTextField
              label="Nome"
              value={name}
              onChangeText={setName}
              errorMessage={nameError}
            />

            <RouteTypeSelectField
              value={routeType}
              onChange={setRouteType}
              error={routeTypeError}
            />

            {/* Endereço de Origem */}
            <AddressFormSection
              title="Endereço de Origem"
              value={origin}
              onChange={(field, text) => setOrigin((prev) => ({ ...prev, [field]: text }))}
              errors={originErrors}
            />

            {/* Endereço de Destino */}
            <AddressFormSection
              title="Endereço de Destino"
              value={destination}
              onChange={(field, text) => setDestination((prev) => ({ ...prev, [field]: text }))}
              errors={destinationErrors}
            />

            {/* Horário e Recorrência */}
            <SectionHeader title="Horário" />

            <AppTextField
              label="Horário de Chegada"
              value={arrivalTime}
              onChangeText={setArrivalTime}
              keyboardType="numeric"
              errorMessage={arrivalTimeError}
            />

            <RecurrenceSelector selectedDays={selectedDays} onChange={setSelectedDays} />
            {recurrenceError && (
              <View style={styles.errorWrapper}>
                <MaterialIcons name="error-outline" size={14} color={colors.destructive} />
              </View>
            )}

            <View style={styles.bottomPadding} />
          </ScrollView>

          {/* Botão fixo */}
          <View style={styles.footer}>
            <PrimaryButton
              label="Salvar Alterações"
              onPress={handleSave}
              icon={<MaterialIcons name="check" size={20} color={colors.light} />}
              style={{ alignSelf: 'stretch' }}
            />
          </View>
        </View>

        {/* Dialog de sucesso */}
        <AppDialog
          visible={successDialogVisible}
          title="Alterações salvas"
          description="As informações da rota foram atualizadas com sucesso!"
          onRequestClose={() => {
            setSuccessDialogVisible(false);
            router.back();
          }}
          actions={[
            {
              label: 'Ok',
              icon: 'check',
              variant: 'default',
              onPress: () => {
                setSuccessDialogVisible(false);
                router.back();
              },
            },
          ]}
        />
      </AppScreenContainer>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  card: {
    marginTop: 32,
    flex: 1,
    backgroundColor: colors.light,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 32,
    paddingTop: 32,
    paddingBottom: 0,
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 16,
  },
  footer: {
    paddingVertical: 16,
    backgroundColor: colors.light,
    alignItems: 'center',
    width: '100%',
  },
  hiddenInput: {
    display: 'none',
  },
  errorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: -8,
  },
  bottomPadding: {
    height: 32,
  },
});
