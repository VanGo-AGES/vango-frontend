import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type SkipActionButtonProps = {
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function SkipActionButton({ onPress, disabled = false, style }: SkipActionButtonProps) {
  const handlePress = () => {
    onPress?.();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={[styles.button, disabled && styles.buttonDisabled, style]}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={20}
          color={disabled ? colors.subtleText : colors.dark}
        />
        <Text style={[styles.label, disabled && styles.labelDisabled]}>Pular</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'column',
    outlineWidth: 1,
    outlineStyle: 'solid',
    outlineColor: colors.dark,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    gap: 8,
  },
  label: {
    ...typography.small,
    color: colors.dark,
    letterSpacing: 0.1,
  },
  labelDisabled: {
    color: colors.subtleText,
  },
});
