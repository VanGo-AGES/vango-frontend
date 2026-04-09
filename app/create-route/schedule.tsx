import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppScreenContainer } from '@/components/ui/app-screen-container';
import { PrimaryButton } from '@/components/primary-button';
import { HourSelector } from '@/components/ui/hour-selector';
import { RouteStepIndicator } from '@/components/ui/route-step-indicator';
import { SectionHeader } from '@/components/ui/section-header';
import { WeekdaySelector } from '@/components/ui/weekday-selector';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export default function ScheduleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [arrival_time, set_arrival_time] = useState('');
  const [selected_days, set_selected_days] = useState<string[]>([]);
  const [show_errors, set_show_errors] = useState(false);

  const has_selected_days = selected_days.length > 0;
  const can_continue = arrival_time.trim() !== '' && has_selected_days;

  const weekday_error =
    show_errors && !has_selected_days ? 'Pelo menos um dia deve ser selecionado' : undefined;

  const handle_continue = () => {
    set_show_errors(true);

    if (!can_continue) return;

    // Substituir pela rota correta na integracao.
    router.push('/exemplo');
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
              label="Continuar"
              variant="secondary"
              onPress={handle_continue}
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
