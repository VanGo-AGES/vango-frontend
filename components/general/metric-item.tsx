import MaterialIcons from '@expo/vector-icons/MaterialIcons';
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
  iconName: ComponentProps<typeof MaterialIcons>['name'];
  title: string;
  unit: (value: string | number) => string;
};

const METRIC_CONFIG: Record<MetricType, MetricConfig> = {
  distance: {
    iconName: 'directions-bus',
    title: 'Km rodados',
    unit: () => 'km',
  },
  duration: {
    iconName: 'alarm',
    title: 'Tempo da viagem',
    unit: () => 'min',
  },
  passengers: {
    iconName: 'directions-walk',
    title: 'Passageiros Transportados',
    unit: (val) => (Number(val) === 1 ? 'passageiro' : 'passageiros'),
  },
  trips: {
    iconName: 'swap-horiz',
    title: 'Viagens Realizadas',
    unit: (val) => (Number(val) === 1 ? 'viagem' : 'viagens'),
  },
};

export function MetricItem({ type, value }: MetricItemProps): ReactElement {
  const { iconName, title, unit } = METRIC_CONFIG[type];

  const currentUnit = unit(value);

  return (
    <View style={styles.container}>
      <MaterialIcons name={iconName} size={24} color={colors.dark} testID={`icon-${type}`} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>
          {value} {currentUnit}
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
    backgroundColor: colors.light,
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    ...typography.bodyLarge,
    color: colors.dark,
  },
  value: {
    ...typography.bodyMedium,
    color: colors.dark,
  },
});
