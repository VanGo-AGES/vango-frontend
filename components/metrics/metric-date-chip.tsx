import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/styles/colors';

export type MetricDateChipProps = {
  label: string;
};

export function MetricDateChip({ label }: MetricDateChipProps) {
  return (
    <View style={styles.chip}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 34,
    borderRadius: 8,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  label: {
    fontFamily: 'WorkSans_400Regular',
    fontSize: 17,
    lineHeight: 22,
    color: colors.dark,
    textAlign: 'center',
  },
});
