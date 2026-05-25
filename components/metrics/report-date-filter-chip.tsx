import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export type ReportDateFilterChipProps = {
  label: string;
  onPress: () => void;
};

export function ReportDateFilterChip({ label, onPress }: ReportDateFilterChipProps) {
  return (
    <Pressable style={styles.chip} onPress={onPress}>
      <View style={styles.content}>
        <MaterialCommunityIcons name="calendar" size={20} color={colors.white} />
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </Pressable>
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
