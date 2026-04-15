import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { PrimaryButton } from '@/components/general/primary-button';
import { HourSelector } from '@/components/route/hour-selector';
import { RouteStepIndicator } from '@/components/route/route-step-indicator';
import { SectionHeader } from '@/components/route/section-header';
import { WeekdaySelector } from '@/components/route/weekday-selector';
import { useCreateRoute } from '@/hooks/use-create-route';
import { useRouteFormStore } from '@/store/route-form.store';
import { ApiError } from '@/services/api';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import type { CreateRouteRequest } from '@/types/route.types';

function formatCep(cep: string): string {
  const digits = cep.replace(/\D/g, '');
  return digits.length === 8 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : cep;
}

export default function ScheduleScreen() {
  const { routeName, routeType, origin, destination, clearForm } = useRouteFormStore();
  const { mutateAsync, isPending } = useCreateRoute();

  const [arrivalTime, setArrivalTime] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  const hasSelectedDays = selectedDays.length > 0;
  const canContinue = arrivalTime.trim() !== '' && hasSelectedDays;
  const weekdayError =
    showErrors && !hasSelectedDays ? 'Pelo menos um dia deve ser selecionado' : undefined;

  const handleContinue = async () => {
    setShowErrors(true);

    if (!canContinue) return;

    const payload: CreateRouteRequest = {
      name: routeName,
      route_type: routeType === 'Volta' ? 'inbound' : 'outbound',
      origin: {
        label: `${origin.rua}, ${origin.numero}`,
        street: origin.rua,
        number: origin.numero,
        neighborhood: origin.bairro,
        zip: formatCep(origin.cep),
        city: origin.cidade,
        state: origin.estado || 'RS',
      },
      destination: {
        label: `${destination.rua}, ${destination.numero}`,
        street: destination.rua,
        number: destination.numero,
        neighborhood: destination.bairro,
        zip: formatCep(destination.cep),
        city: destination.cidade,
        state: destination.estado || 'RS',
      },
      expected_time: `${arrivalTime}:00`,
      recurrence: selectedDays.map((d) => d.toLowerCase()).join(','),
    };

    try {
      const response = await mutateAsync(payload);
      clearForm();

      router.push({
        pathname: '/route-invite-code-screen',
        params: { inviteCode: response.invite_code },
      } as never);
    } catch (error) {
      const message =
        error instanceof ApiError && typeof error.detail === 'string' && error.detail
          ? error.detail
          : 'Não foi possível criar a rota. Tente novamente.';

      Alert.alert('Erro ao criar rota', message, [{ text: 'OK' }]);
    }
  };

  return (
    <AppScreenContainer
      backgroundColor={colors.accent}
      style={styles.container}
      edges={['right', 'bottom', 'left']}
    >
      <View style={styles.topSection}>
        <SectionHeader
          title="Criar Rota"
          subtitle="Preencha as informações para criar sua rota."
          showBackButton
        />
      </View>

      <View style={styles.contentCard}>
        <View>
          <Text style={styles.sectionTitle}>Horário</Text>

          <HourSelector
            value={arrivalTime}
            onChange={setArrivalTime}
            showError={showErrors}
            style={styles.hourSelector}
          />

          <WeekdaySelector
            value={selectedDays}
            onChange={setSelectedDays}
            error={weekdayError}
            style={styles.weekdaySelector}
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.stepIndicatorWrapper}>
            <RouteStepIndicator currentStep={4} totalSteps={4} />
          </View>

          <View style={styles.buttonWrapper}>
            <PrimaryButton
              label={isPending ? 'Criando rota...' : 'Continuar'}
              variant="secondary"
              onPress={handleContinue}
              disabled={isPending}
              icon={<MaterialIcons name="arrow-forward" size={20} color={colors.light} />}
            />
          </View>
        </View>
      </View>
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    backgroundColor: colors.accent,
    marginTop: -24,
    marginHorizontal: -24,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 52,
    gap: 16,
  },
  contentCard: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 64,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.light,
    marginHorizontal: -24,
    marginBottom: -80,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    marginBottom: 24,
    textAlign: 'center',
    color: colors.dark,
    ...typography.header3,
  },
  hourSelector: {
    marginBottom: 20,
  },
  weekdaySelector: {
    marginBottom: 8,
  },
  footer: {
    alignItems: 'center',
    gap: 28,
    paddingTop: 32,
  },
  stepIndicatorWrapper: {
    alignSelf: 'center',
  },
  buttonWrapper: {
    alignSelf: 'center',
  },
});
