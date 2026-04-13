import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
import type { CreateRouteRequest, RouteType } from '@/types/route.types';

function mapRouteType(type: 'Ida' | 'Volta' | ''): RouteType {
  return type === 'Volta' ? 'inbound' : 'outbound';
}

function formatCep(cep: string): string {
  const digits = cep.replace(/\D/g, '');
  return digits.length === 8 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : cep;
}

export default function ScheduleScreen() {
  const router = useRouter();

  const { routeName, routeType, origin, destination, clearForm } = useRouteFormStore();
  const { mutateAsync, isPending } = useCreateRoute();

  const [arrival_time, set_arrival_time] = useState('');
  const [selected_days, set_selected_days] = useState<string[]>([]);
  const [show_errors, set_show_errors] = useState(false);

  const has_selected_days = selected_days.length > 0;
  const can_continue = arrival_time.trim() !== '' && has_selected_days;

  const weekday_error =
    show_errors && !has_selected_days ? 'Pelo menos um dia deve ser selecionado' : undefined;

  const handle_continue = async () => {
    set_show_errors(true);

    if (!can_continue) return;

    const payload: CreateRouteRequest = {
      name: routeName,
      route_type: mapRouteType(routeType),
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
      expected_time: `${arrival_time}:00`,
      recurrence: selected_days.map((d) => d.toLowerCase()).join(','),
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
        error instanceof ApiError && error.detail
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

      <View style={styles.content_card}>
        <View>
          <Text style={styles.section_title}>Horário</Text>

          <HourSelector
            value={arrival_time}
            onChange={set_arrival_time}
            showError={show_errors}
            style={styles.hour_selector}
          />

          <WeekdaySelector
            value={selected_days}
            onChange={set_selected_days}
            error={weekday_error}
            style={styles.weekday_selector}
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.step_indicator_wrapper}>
            <RouteStepIndicator currentStep={4} totalSteps={4} />
          </View>

          <View style={styles.button_wrapper}>
            <PrimaryButton
              label={isPending ? 'Criando rota...' : 'Continuar'}
              variant="secondary"
              onPress={handle_continue}
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
  content_card: {
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
  section_title: {
    marginBottom: 24,
    textAlign: 'center',
    color: colors.dark,
    ...typography.header3,
  },
  hour_selector: {
    marginBottom: 20,
  },
  weekday_selector: {
    marginBottom: 8,
  },
  footer: {
    alignItems: 'center',
    gap: 28,
    paddingTop: 32,
  },
  step_indicator_wrapper: {
    alignSelf: 'center',
  },
  button_wrapper: {
    alignSelf: 'center',
  },
});
