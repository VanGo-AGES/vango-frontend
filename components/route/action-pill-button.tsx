import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Href, useRouter } from 'expo-router';
import { ReactNode } from 'react';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export interface ActionPillButtonProps {
  onPress?: () => void;
  href?: Href;
  icon?: ReactNode;
  label: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ActionPillButton({
  onPress,
  icon,
  href,
  label,
  disabled = false,
  style,
}: ActionPillButtonProps) {
  const router = useRouter();
  const handlePress = () => {
    if (href) {
      router.push(href);
    }
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
        <Text style={[styles.icon, disabled && styles.labelDisabled]}>{icon}</Text>
        <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 100,
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
    gap: 8,
  },
  icon: {
    color: colors.dark,
  },
  label: {
    ...typography.buttonText,
    fontSize: 16,
    color: colors.dark,
    letterSpacing: 0.3,
  },
  labelDisabled: {
    color: colors.subtleText,
  },
});
