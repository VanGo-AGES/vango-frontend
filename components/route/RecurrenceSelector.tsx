import { ScrollView, Text, StyleSheet, Pressable, ViewStyle, StyleProp } from 'react-native';
import { typography } from '@/styles/typography';
import { colors } from '@/styles/colors';

export interface RecurrenceSelectorProps {
  selectedDays: string[];
  onChange: (days: string[]) => void;
  style?: StyleProp<ViewStyle>;
}

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

export function RecurrenceSelector({ selectedDays, onChange, style }: RecurrenceSelectorProps) {
  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter((d) => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.chipGroup, style]}
      style={styles.scrollView}
    >
      {WEEKDAYS.map((day) => {
        const isSelected = selectedDays.includes(day);

        return (
          <Pressable
            key={day}
            onPress={() => toggleDay(day)}
            style={[styles.chip, isSelected ? styles.chipSelected : styles.chipUnselected]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isSelected }}
          >
            <Text
              style={[
                styles.chipText,
                isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
              ]}
            >
              {day}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chipGroup: {
    flexDirection: 'row',
    columnGap: 8,
    paddingVertical: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  chipUnselected: {
    backgroundColor: 'transparent',
    borderColor: colors.subtleText,
  },
  chipSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  chipText: {
    ...typography.small,
  },
  chipTextUnselected: {
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.dark,
    fontFamily: typography.bodyBold.fontFamily,
  },
  scrollView: {
    flexGrow: 0,
    height: 48,
  },
});
