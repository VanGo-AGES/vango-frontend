import { useMemo, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';

import { AppScreenContainer } from '@/components/general/app-screen-container';
import type { MetricItemProps } from '@/components/general/metric-item';
import { MetricList } from '@/components/metrics/metric-list';
import { ReportDateFilterChip } from '@/components/metrics/report-date-filter-chip';
import { ReportPeriodTabs, type ReportPeriodType } from '@/components/metrics/report-period-tabs';
import { SectionHeader } from '@/components/route/section-header';
import { colors, withAlpha } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { useTripReport } from '@/hooks/use-trip-report';

type SelectedDates = {
  startDate?: Date;
  endDate?: Date;
};

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date: Date) {
  const normalized = startOfDay(date);
  const weekday = normalized.getDay();
  const offset = weekday === 0 ? -6 : 1 - weekday;
  normalized.setDate(normalized.getDate() + offset);
  return normalized;
}

function endOfWeek(date: Date) {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return end;
}

function getDefaultDates(period: ReportPeriodType, referenceDate = new Date()): SelectedDates {
  if (period === 'week') {
    const weekStart = startOfWeek(referenceDate);
    return {
      startDate: weekStart,
      endDate: endOfWeek(referenceDate),
    };
  }

  if (period === 'month') {
    return {
      startDate: new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1),
    };
  }

  return {
    startDate: startOfDay(referenceDate),
  };
}

export default function TripReportsScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriodType>('day');
  const [selectedDates, setSelectedDates] = useState<SelectedDates>(() => getDefaultDates('day'));

  const {
    data: metrics,
    isLoading,
    isError,
    refetch,
  } = useTripReport(selectedPeriod, selectedDates.startDate, selectedDates.endDate);

  const periodLabel = useMemo(() => {
    if (selectedPeriod === 'day' && selectedDates.startDate) {
      return selectedDates.startDate.toLocaleDateString('pt-BR');
    }
    if (selectedPeriod === 'week' && selectedDates.startDate && selectedDates.endDate) {
      const start = selectedDates.startDate.toLocaleDateString('pt-BR');
      const end = selectedDates.endDate.toLocaleDateString('pt-BR');
      return `${start} - ${end}`;
    }
    if (selectedPeriod === 'month' && selectedDates.startDate) {
      const monthName = MONTH_NAMES[selectedDates.startDate.getMonth()];
      return `${monthName} ${selectedDates.startDate.getFullYear()}`;
    }
    return '';
  }, [selectedPeriod, selectedDates]);

  const metricsItems: MetricItemProps[] = useMemo(
    () => [
      { type: 'distance', value: metrics?.distance ?? 0 },
      { type: 'duration', value: metrics?.duration ?? 0 },
      { type: 'passengers', value: metrics?.passengers ?? 0 },
      { type: 'trips', value: metrics?.trips ?? 0 },
    ],
    [metrics],
  );

  const handleChangePeriod = (period: ReportPeriodType) => {
    setSelectedPeriod(period);
    setSelectedDates(getDefaultDates(period));
  };

  const handleDateChange = (dates: SelectedDates) => {
    setSelectedDates(dates);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <AppScreenContainer
        backgroundColor={colors.accent}
        edges={['top', 'left', 'right']}
        style={styles.container}
      >
        <View style={styles.headerBlock}>
          <View style={styles.headerSurface}>
            <SectionHeader
              title="Relatórios"
              subtitle={'Visualize estatísticas\nconsolidadas das suas viagens'}
              showBackButton
              onBackPress={() => router.back()}
            />
          </View>
        </View>

        <View style={styles.sheet}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.tabsCard}>
              <ReportPeriodTabs
                selectedPeriod={selectedPeriod}
                onChangePeriod={handleChangePeriod}
              />
            </View>

            <View style={styles.filterRow}>
              <ReportDateFilterChip
                key={selectedPeriod}
                label={periodLabel}
                periodType={selectedPeriod}
                initialStartDate={selectedDates.startDate}
                initialEndDate={selectedDates.endDate}
                onDateChange={handleDateChange}
              />
            </View>

            <View style={styles.metricsCard}>
              {isLoading ? (
                <View style={styles.stateContainer}>
                  <ActivityIndicator animating color={colors.primary} size="large" />
                </View>
              ) : isError ? (
                <View style={styles.stateContainer}>
                  <Text style={styles.errorText}>Bah, não conseguimos carregar os dados.</Text>
                  <Button mode="text" onPress={() => refetch()} textColor={colors.primary}>
                    Tentar Novamente
                  </Button>
                </View>
              ) : (
                <MetricList metrics={metricsItems} />
              )}
            </View>
          </ScrollView>
        </View>
      </AppScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  headerBlock: {
    paddingHorizontal: 24,
    paddingBottom: 26,
  },
  headerSurface: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: colors.accent,
    paddingHorizontal: 0,
    paddingTop: 8,
    paddingBottom: 12,
  },
  sheet: {
    flex: 1,
    marginTop: 12,
    backgroundColor: colors.light,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 27,
    paddingBottom: 32,
    gap: 32,
  },
  tabsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.accent,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  filterRow: {
    alignItems: 'flex-start',
    marginBottom: -16,
  },
  metricsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: withAlpha(colors.separator, 0.4),
    minHeight: 150,
  },
  stateContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  errorText: {
    ...typography?.body,
    color: colors.dark,
    marginBottom: 8,
    textAlign: 'center',
  },
});
