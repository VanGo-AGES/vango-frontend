import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export type RecenterMapButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function RecenterMapButton({ onPress, disabled = false, style }: RecenterMapButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Centralizar mapa"
      accessibilityState={{ disabled }}
      style={[styles.button, disabled && styles.buttonDisabled, style]}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons
          name="crosshairs-gps"
          size={20}
          color={disabled ? colors.subtleText : colors.dark}
        />
        <Text style={[styles.label, disabled && styles.labelDisabled]}>Centralizar</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    borderRadius: 999,
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    ...typography.small,
    color: colors.dark,
  },
  labelDisabled: {
    color: colors.subtleText,
  },
});
