import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import AppDialog from '@/components/general/app-dialog';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { AppTextField } from '@/components/general/app-text-field';
import { EmptyState } from '@/components/general/empty-state';
import { PrimaryButton } from '@/components/general/primary-button';
import { AddressFormSection } from '@/components/route/address-form-section';
import { RecurrenceSelector } from '@/components/route/recurrence-selector';
import { RouteTypeSelectField, type RouteType } from '@/components/route/route-type-select-field';
import { SectionHeader } from '@/components/route/section-header';
import { useRoute } from '@/hooks/use-route';
import { useUpdateRoute } from '@/hooks/use-update-route';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import type {
  AddressErrors,
  AddressResponse,
  RouteFormAddress,
  RouteType as ApiRouteType,
  RouteUpdate,
} from '@/types/route.types';

function mapAddressToForm(address: AddressResponse): RouteFormAddress {
  return {
    cep: (address.zip ?? '').replace(/\D/g, ''),
    numero: address.number ?? '',
    rua: address.street ?? '',
    bairro: address.neighborhood ?? '',
    cidade: address.city ?? '',
    estado: address.state ?? '',
  };
}

function formatTimeForUi(value: string): string {
  return value.length >= 5 ? value.slice(0, 5) : value;
}

function mapRecurrenceToUi(value: string): string[] {
  return value
    .split(',')
    .map((day) => day.trim())
    .filter(Boolean)
    .map((day) => day.charAt(0).toUpperCase() + day.slice(1));
}

function mapRouteTypeToUi(routeType: ApiRouteType): RouteType {
  return routeType === 'outbound' ? 'Ida' : 'Volta';
}

function mapRouteTypeToApi(routeType: RouteType): ApiRouteType {
  return routeType === 'Ida' ? 'outbound' : 'inbound';
}

function mapRecurrenceToApi(days: string[]): string {
  return days.map((day) => day.toLowerCase()).join(',');
}

function formatTimeForApi(time: string): string {
  return time.length === 5 ? `${time}:00` : time;
}

function mapAddressToRequest(address: RouteFormAddress, label = '') {
  return {
    label,
    street: address.rua,
    number: address.numero,
    neighborhood: address.bairro,
    zip: address.cep,
    city: address.cidade,
    state: address.estado,
  };
}

function areAddressesEqual(a: RouteFormAddress, b: RouteFormAddress): boolean {
  return (
    a.cep === b.cep &&
    a.numero === b.numero &&
    a.rua === b.rua &&
    a.bairro === b.bairro &&
    a.cidade === b.cidade &&
    a.estado === b.estado
  );
}

export default function EditRouteScreen() {
  const { routeId } = useLocalSearchParams<{ routeId: string }>();

  const { data: route, isLoading, isError, refetch } = useRoute(routeId);

  const updateRouteMutation = useUpdateRoute();

  const [name, setName] = useState('');
  const [routeType, setRouteType] = useState<RouteType | undefined>();

  const [origin, setOrigin] = useState<RouteFormAddress>({
    cep: '',
    numero: '',
    rua: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  const [destination, setDestination] = useState<RouteFormAddress>({
    cep: '',
    numero: '',
    rua: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  const [arrivalTime, setArrivalTime] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const [originErrors, setOriginErrors] = useState<AddressErrors>({});
  const [destinationErrors, setDestinationErrors] = useState<AddressErrors>({});
  const [nameError, setNameError] = useState<string | undefined>();
  const [routeTypeError, setRouteTypeError] = useState<string | undefined>();
  const [arrivalTimeError, setArrivalTimeError] = useState<string | undefined>();
  const [recurrenceError, setRecurrenceError] = useState<string | undefined>();

  const [successDialogVisible, setSuccessDialogVisible] = useState(false);
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);

  useEffect(() => {
    if (!route) return;

    setName(route.name);
    setRouteType(mapRouteTypeToUi(route.route_type));
    setOrigin(mapAddressToForm(route.origin_address));
    setDestination(mapAddressToForm(route.destination_address));
    setArrivalTime(formatTimeForUi(route.expected_time));
    setSelectedDays(mapRecurrenceToUi(route.recurrence));
  }, [route]);

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
      if (!origin[field].trim()) {
        nextOriginErrors[field] = 'Este campo é obrigatório.';
      }
    });

    setOriginErrors(nextOriginErrors);

    if (Object.keys(nextOriginErrors).length > 0) {
      valid = false;
    }

    const nextDestinationErrors: AddressErrors = {};

    requiredFields.forEach((field) => {
      if (!destination[field].trim()) {
        nextDestinationErrors[field] = 'Este campo é obrigatório.';
      }
    });

    setDestinationErrors(nextDestinationErrors);

    if (Object.keys(nextDestinationErrors).length > 0) {
      valid = false;
    }

    return valid;
  };

  const handleSave = () => {
    if (!validateForm() || !routeId || !routeType || !route) {
      return;
    }

    const data: RouteUpdate = {};

    const apiRouteType = mapRouteTypeToApi(routeType);
    const apiExpectedTime = formatTimeForApi(arrivalTime);
    const apiRecurrence = mapRecurrenceToApi(selectedDays);

    const originalOrigin = mapAddressToForm(route.origin_address);
    const originalDestination = mapAddressToForm(route.destination_address);

    if (name !== route.name) {
      data.name = name;
    }

    if (apiRouteType !== route.route_type) {
      data.route_type = apiRouteType;
    }

    if (apiExpectedTime !== route.expected_time) {
      data.expected_time = apiExpectedTime;
    }

    if (apiRecurrence !== route.recurrence) {
      data.recurrence = apiRecurrence;
    }

    if (!areAddressesEqual(origin, originalOrigin)) {
      data.origin = mapAddressToRequest(origin, route.origin_address.label);
    }

    if (!areAddressesEqual(destination, originalDestination)) {
      data.destination = mapAddressToRequest(destination, route.destination_address.label);
    }

    if (Object.keys(data).length === 0) {
      setSuccessDialogVisible(true);
      return;
    }

    updateRouteMutation.mutate(
      { id: routeId, data },
      {
        onSuccess: () => setSuccessDialogVisible(true),
        onError: () => setErrorDialogVisible(true),
      },
    );
  };

  if (isLoading) {
    return (
      <AppScreenContainer
        backgroundColor={colors.accent}
        edges={['top', 'left', 'right']}
        style={styles.container}
      >
        <SectionHeader
          title="Editar Rota"
          subtitle={'Atualize as informações\nda sua rota.'}
          showBackButton
        />

        <View style={styles.feedbackWrapper}>
          <EmptyState icon="schedule" text="Carregando dados da rota..." />
        </View>
      </AppScreenContainer>
    );
  }

  if (isError || !route) {
    return (
      <AppScreenContainer
        backgroundColor={colors.accent}
        edges={['top', 'left', 'right']}
        style={styles.container}
      >
        <SectionHeader
          title="Editar Rota"
          subtitle={'Atualize as informações\nda sua rota.'}
          showBackButton
        />

        <View style={styles.feedbackWrapper}>
          <EmptyState icon="error-outline" text="Não foi possível carregar a rota." />

          <PrimaryButton
            label="Tentar novamente"
            onPress={() => refetch()}
            labelColor={colors.white}
            style={styles.retryButton}
          />
        </View>
      </AppScreenContainer>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <AppScreenContainer
        backgroundColor={colors.accent}
        edges={['top', 'left', 'right']}
        style={styles.container}
      >
        <SectionHeader
          title="Editar Rota"
          subtitle={'Atualize as informações\nda sua rota.'}
          showBackButton
        />

        <View style={styles.card}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.sectionTitle}>Informações</Text>

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

            <View style={styles.divider} />

            <AddressFormSection
              title="Endereço de Origem"
              value={origin}
              onChange={(field, text) => setOrigin((prev) => ({ ...prev, [field]: text }))}
              errors={originErrors}
            />

            <View style={styles.divider} />

            <AddressFormSection
              title="Endereço de Destino"
              value={destination}
              onChange={(field, text) =>
                setDestination((prev) => ({
                  ...prev,
                  [field]: text,
                }))
              }
              errors={destinationErrors}
            />

            <View style={styles.divider} />

            <Text style={styles.sectionTitle}>Horário</Text>

            <AppTextField
              label="Horário de Chegada"
              value={arrivalTime}
              onChangeText={setArrivalTime}
              errorMessage={arrivalTimeError}
            />

            <RecurrenceSelector selectedDays={selectedDays} onChange={setSelectedDays} />

            {recurrenceError && (
              <View style={styles.errorWrapper}>
                <MaterialIcons name="error-outline" size={14} color={colors.destructive} />

                <Text style={styles.errorText}>{recurrenceError}</Text>
              </View>
            )}

            <View style={styles.bottomPadding} />
          </ScrollView>

          <View style={styles.footer}>
            <PrimaryButton
              label="Salvar Alterações"
              onPress={handleSave}
              icon={<MaterialIcons name="check" size={20} color={colors.light} />}
              labelColor={colors.white}
              style={{ alignSelf: 'stretch' }}
              disabled={updateRouteMutation.isPending}
            />
          </View>
        </View>

        {updateRouteMutation.isPending && (
          <View style={styles.savingOverlay}>
            <EmptyState icon="schedule" text="Salvando alterações..." />
          </View>
        )}

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

        <AppDialog
          visible={errorDialogVisible}
          title="Erro ao salvar"
          description="Não foi possível salvar as alterações. Verifique se a rota não está em andamento e tente novamente."
          onRequestClose={() => setErrorDialogVisible(false)}
          actions={[
            {
              label: 'Ok',
              icon: 'close',
              variant: 'default',
              onPress: () => setErrorDialogVisible(false),
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
    paddingHorizontal: 16,
  },

  sectionTitle: {
    ...typography.bodyBold,
    color: colors.dark,
    textAlign: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: colors.accent,
  },

  footer: {
    paddingVertical: 16,
    backgroundColor: colors.light,
    alignItems: 'center',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: colors.accent,
  },

  errorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: -8,
  },

  errorText: {
    ...typography.caption,
    color: colors.destructive,
  },

  bottomPadding: {
    height: 32,
  },

  feedbackWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },

  retryButton: {
    alignSelf: 'center',
  },

  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(250, 252, 254, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
