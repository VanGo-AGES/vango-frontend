import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Href, useRouter } from 'expo-router';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const VARIANT_LABELS = {
  driver: 'Chamar Passageiro',
  passenger: 'Chamar Motorista',
} as const;

export type ContactActionButtonProps = {
  onPress: () => void;
  href?: Href;
  variant: 'driver' | 'passenger';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ContactActionButton({
  onPress,
  href,
  variant,
  disabled = false,
  style,
}: ContactActionButtonProps) {
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
        <MaterialCommunityIcons
          name="phone-hangup"
          size={20}
          color={disabled ? colors.subtleText : colors.dark}
        />
        <Text style={[styles.label, disabled && styles.labelDisabled]}>
          {VARIANT_LABELS[variant]}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.primary,
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
