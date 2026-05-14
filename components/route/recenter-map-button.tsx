import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ReactNode } from 'react';

import { colors } from '@/styles/colors';

export type RecenterMapButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: ReactNode;
};

export function RecenterMapButton({
  onPress,
  disabled = false,
  style,
  icon,
}: RecenterMapButtonProps) {
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
      {icon ? (
        icon
      ) : (
        <MaterialCommunityIcons
          name="fullscreen"
          size={32}
          color={disabled ? colors.subtleText : colors.dark}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
});
