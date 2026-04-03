import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export type ButtonVariant = 'primary' | 'secondary';

export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  icon?: React.ReactNode;
  labelColor?: string;
  style?: StyleProp<ViewStyle>;
}

const variantStyles: Record<ButtonVariant, { textColor: string; backgroundColor: string }> = {
  primary: {
    textColor: colors.primary,
    backgroundColor: colors.dark,
  },
  secondary: {
    textColor: colors.light,
    backgroundColor: colors.dark,
  },
};

const styles = StyleSheet.create({
  buttonFlexBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  content: {
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  stateLayer: {
    gap: 8,
  },
  label: {
    ...typography.bodyBold,
  },
  labelDisabled: {
    color: colors.subtleText,
  },
});

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
  labelColor,
  style,
}: PrimaryButtonProps) {
  const variantStyle = variantStyles[variant];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles.buttonFlexBox,
        { backgroundColor: disabled ? colors.accent : variantStyle.backgroundColor },
        disabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      <View style={[styles.content, styles.buttonFlexBox]}>
        <View style={[styles.stateLayer, styles.buttonFlexBox]}>
          {icon && <View>{icon}</View>}
          <Text
            style={[
              styles.label,
              disabled && styles.labelDisabled,
              !disabled && { color: labelColor ?? variantStyle.textColor },
            ]}
          >
            {label}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
