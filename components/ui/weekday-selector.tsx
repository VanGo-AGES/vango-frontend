import { View, Text, StyleSheet, Pressable, ViewStyle, StyleProp } from 'react-native';
import { typography } from '@/styles/typography';
import { colors } from '@/styles/colors';

export interface WeekdaySelectorProps {
  value: string[];
  onChange: (days: string[]) => void;
  error?: string;
  style?: StyleProp<ViewStyle>;
}

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

export function WeekdaySelector({ value, onChange, error, style }: WeekdaySelectorProps) {
  const toggleDay = (day: string) => {
    if (value.includes(day)) {
      onChange(value.filter((d) => d !== day));
    } else {
      onChange([...value, day]);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Recorrência</Text>

      <View style={[styles.chipGroup, error ? styles.chipGroupError : null]}>
        {WEEKDAYS.map((day) => {
          const isSelected = value.includes(day);

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
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  label: {
    backgroundColor: colors.primary,
    ...typography.small,
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 16,
    columnGap: 8,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipGroupError: {
    borderColor: colors.destructive,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
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
  errorText: {
    color: colors.destructive,
    ...typography.caption,
    marginTop: 4,
  },
});
