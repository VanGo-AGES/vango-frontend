import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
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

export const PrimaryButton = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  icon,
  labelColor,
}: PrimaryButtonProps) => {
  const variantStyle = variantStyles[variant];

  const styles = StyleSheet.create({
    buttonFlexBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      backgroundColor: disabled ? colors.accent : variantStyle.backgroundColor,
      borderRadius: 999,
      opacity: disabled ? 0.6 : 1,
      alignSelf: 'flex-start',
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
      color: disabled ? colors.subtleText : (labelColor ?? variantStyle.textColor),
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, styles.buttonFlexBox]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={[styles.content, styles.buttonFlexBox]}>
        <View style={[styles.stateLayer, styles.buttonFlexBox]}>
          {icon && <View>{icon}</View>}
          <Text style={styles.label}>{label}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
