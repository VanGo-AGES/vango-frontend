import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export type MetricDateChipProps = {
  label: string;
  style?: StyleProp<ViewStyle>;
};

export function MetricDateChip({ label, style }: MetricDateChipProps) {
  return (
    <View style={[styles.chip, styles.shadow, style]}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 32,
    borderRadius: 8,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light,
    paddingHorizontal: 8,
  },
  shadow: {
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    ...typography.small,
    color: colors.dark,
    textAlign: 'center',
  },
});
