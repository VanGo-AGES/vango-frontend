import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

type MetricType = 'distance' | 'duration' | 'passengers' | 'trips';

export type MetricItemProps = {
  type: MetricType;
  value: string | number;
};

type MetricConfig = {
  iconName: ComponentProps<typeof Ionicons>['name'];
  title: string;
  unit: string;
};

const METRIC_CONFIG: Record<MetricType, MetricConfig> = {
  distance: {
    iconName: 'bus-outline',
    title: 'Km rodados',
    unit: 'km',
  },
  duration: {
    iconName: 'time-outline',
    title: 'Tempo da viagem',
    unit: 'min',
  },
  passengers: {
    iconName: 'walk-outline',
    title: 'Passageiros Transportados',
    unit: 'passageiros',
  },
  trips: {
    iconName: 'swap-horizontal-outline',
    title: 'Viagens Realizadas',
    unit: 'viagens',
  },
};

export function MetricItem({ type, value }: MetricItemProps): ReactElement {
  const { iconName, title, unit } = METRIC_CONFIG[type];

  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={20} color={colors.text} testID={`icon-${type}`} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>
          {value} {unit}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.separator,
    borderRadius: 8,
  },
  textContainer: {
    flexDirection: 'column',
  },
  title: {
    ...typography.small,
    color: colors.dark,
  },
  value: {
    ...typography.small,
    color: colors.text,
  },
});
