import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Href, useRouter } from 'expo-router';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export interface CreateRouteButtonProps {
  onPress?: () => void;
  href?: Href;
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function CreateRouteButton({
  onPress,
  href,
  label = 'CRIAR ROTA',
  disabled = false,
  style,
}: CreateRouteButtonProps) {
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
        <Text style={[styles.plus, disabled && styles.labelDisabled]}>+</Text>
        <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.light,
    borderWidth: 1,
    borderColor: colors.subtleText,
    borderRadius: 12,
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
  plus: {
    ...typography.buttonText,
    color: colors.dark,
    fontSize: 18,
  },
  label: {
    ...typography.buttonText,
    color: colors.dark,
    letterSpacing: 0.3,
  },
  labelDisabled: {
    color: colors.subtleText,
  },
});
