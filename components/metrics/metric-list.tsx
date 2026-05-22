import { StyleSheet, View } from 'react-native';

import { MetricItem, type MetricItemProps } from '@/components/general/metric-item';
import { colors } from '@/styles/colors';

type MetricListProps = {
  metrics: MetricItemProps[];
};

export function MetricList({ metrics }: MetricListProps) {
  return (
    <View style={styles.container}>
      {metrics.map((metric, index) => (
        <View key={`${metric.type}-${index}`}>
          <MetricItem {...metric} />

          {index < metrics.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light,
    width: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: colors.accent,
  },
});
