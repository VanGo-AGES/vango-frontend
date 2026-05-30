import { useMemo, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppScreenContainer } from '@/components/general/app-screen-container';
import type { MetricItemProps } from '@/components/general/metric-item';
import { MetricList } from '@/components/metrics/metric-list';
import { ReportDateFilterChip } from '@/components/metrics/report-date-filter-chip';
import { ReportPeriodTabs, type ReportPeriodType } from '@/components/metrics/report-period-tabs';
import { SectionHeader } from '@/components/route/section-header';
import { colors, withAlpha } from '@/styles/colors';

type SelectedDates = {
  startDate?: Date;
  endDate?: Date;
};

type TripReportFilters = {
  period: ReportPeriodType;
  startDate: Date;
  endDate?: Date;
};

type TripReportMetrics = {
  distance: number;
  duration: number;
  passengers: number;
  trips: number;
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

function differenceInDays(start: Date, end: Date) {
  const millisPerDay = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / millisPerDay));
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

function formatTripReportPeriodLabel(filters: TripReportFilters): string {
  if (filters.period === 'day') {
    return filters.startDate.toLocaleDateString('pt-BR');
  }

  if (filters.period === 'week' && filters.endDate) {
    const start = filters.startDate.toLocaleDateString('pt-BR');
    const end = filters.endDate.toLocaleDateString('pt-BR');
    return `${start} - ${end}`;
  }

  if (filters.period === 'month') {
    const monthName = MONTH_NAMES[filters.startDate.getMonth()];
    return `${monthName} ${filters.startDate.getFullYear()}`;
  }

  return '';
}

function buildTripReportMetrics(filters: TripReportFilters): TripReportMetrics {
  const { period, startDate, endDate } = filters;
  const referenceDate = startDate ?? new Date();
  const dayOfMonth = referenceDate.getDate();
  const monthIndex = referenceDate.getMonth();
  const daysInMonth = new Date(referenceDate.getFullYear(), monthIndex + 1, 0).getDate();
  const weekDays = endDate ? differenceInDays(startDate, endDate) + 1 : 7;
  const seed = referenceDate.getFullYear() + monthIndex + dayOfMonth;

  if (period === 'week') {
    return {
      distance: weekDays * 11 + (seed % 5) * 2,
      duration: weekDays * 34 + (seed % 4) * 6,
      passengers: weekDays * 15 + (seed % 7),
      trips: weekDays * 4 + (seed % 3),
    };
  }

  if (period === 'month') {
    return {
      distance: daysInMonth * 10 + monthIndex * 6,
      duration: daysInMonth * 27 + (seed % 5) * 8,
      passengers: daysInMonth * 4 + (seed % 11),
      trips: Math.max(1, Math.round(daysInMonth * 1.1 + (seed % 4))),
    };
  }

  return {
    distance: 10 + (dayOfMonth % 4) * 2,
    duration: 28 + (dayOfMonth % 5) * 4,
    passengers: 12 + (dayOfMonth % 6) * 2,
    trips: 1,
  };
}

export default function TripReportsScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriodType>('day');
  const [selectedDates, setSelectedDates] = useState<SelectedDates>(() => getDefaultDates('day'));

  const reportFilters = useMemo<TripReportFilters>(
    () => ({
      period: selectedPeriod,
      startDate: selectedDates.startDate ?? new Date(),
      endDate: selectedDates.endDate,
    }),
    [selectedPeriod, selectedDates.endDate, selectedDates.startDate],
  );

  const metrics = useMemo(() => buildTripReportMetrics(reportFilters), [reportFilters]);
  const periodLabel = formatTripReportPeriodLabel(reportFilters);
  const metricsItems: MetricItemProps[] = [
    { type: 'distance', value: metrics?.distance ?? 0 },
    { type: 'duration', value: metrics?.duration ?? 0 },
    { type: 'passengers', value: metrics?.passengers ?? 0 },
    { type: 'trips', value: metrics?.trips ?? 0 },
  ];

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
              <MetricList metrics={metricsItems} />
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
  },
});
