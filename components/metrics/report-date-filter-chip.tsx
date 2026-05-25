import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export type ReportDateFilterChipProps = {
  periodType: 'day' | 'week' | 'month';
  label: string;
  onPress: () => void;
};

export function ReportDateFilterChip({ label, onPress }: ReportDateFilterChipProps) {
  return (
    <Pressable style={styles.chip} onPress={onPress}>
      <View style={styles.content}>
        <MaterialCommunityIcons name="calendar" size={16} color={colors.white} />
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 34,
    borderRadius: 8,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark,
    paddingHorizontal: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    ...typography.small,
    color: colors.white,
  },
});
