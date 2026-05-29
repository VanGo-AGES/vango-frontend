import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import {
  ReportDateFilterSelectors,
  PeriodType,
  SelectedDates,
} from './report-date-filter-selectors';

export type ReportDateFilterChipProps = {
  label: string;
  periodType: PeriodType;
  onDateChange?: (dates: SelectedDates) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
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

function formatLabel(periodType: PeriodType, dates: SelectedDates): string {
  if (periodType === 'day' && dates.startDate) {
    return dates.startDate.toLocaleDateString('pt-BR');
  }

  if (periodType === 'week' && dates.startDate && dates.endDate) {
    const start = dates.startDate.toLocaleDateString('pt-BR');
    const end = dates.endDate.toLocaleDateString('pt-BR');
    return `${start} - ${end}`;
  }

  if (periodType === 'month' && dates.startDate) {
    const month = MONTH_NAMES[dates.startDate.getMonth()];
    const year = dates.startDate.getFullYear();
    return `${month} ${year}`;
  }

  return '';
}

export function ReportDateFilterChip({
  label: initialLabel,
  periodType,
  onDateChange,
  initialStartDate,
  initialEndDate,
}: ReportDateFilterChipProps) {
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState(initialLabel);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const handleConfirm = (dates: SelectedDates) => {
    setStartDate(dates.startDate);
    setEndDate(dates.endDate);

    const newLabel = formatLabel(periodType, dates);
    if (newLabel) {
      setLabel(newLabel);
    }

    onDateChange?.(dates);
    setVisible(false);
  };

  return (
    <>
      <Pressable style={styles.chip} onPress={() => setVisible(true)}>
        <View style={styles.content}>
          <MaterialCommunityIcons name="calendar" size={20} color={colors.white} />
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Pressable>

      <ReportDateFilterSelectors
        visible={visible}
        periodType={periodType}
        onDismiss={() => setVisible(false)}
        onConfirm={handleConfirm}
        initialStartDate={startDate}
        initialEndDate={endDate}
      />
    </>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 40,
    borderRadius: 12,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    ...typography.labelLarge,
    color: colors.white,
  },
});
