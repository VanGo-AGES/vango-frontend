import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { colors } from '@/styles/colors';

type CircleIconButtonProps = {
  icon: 'arrow-forward' | 'arrow-back';
  onPress: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
};

export function CircleIconButton({
  icon,
  onPress,
  style,
  accessibilityLabel,
}: CircleIconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? getAccessibilityLabel(icon)}
      style={({ pressed }) => [styles.button, style, pressed && styles.buttonPressed]}
    >
      <MaterialIcons name={icon} size={24} color={colors.dark} />
    </Pressable>
  );
}

function getAccessibilityLabel(icon: 'arrow-forward' | 'arrow-back') {
  if (icon === 'arrow-back') {
    return 'voltar';
  }

  return 'avançar';
}

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonPressed: {
    opacity: 0.6,
  },
});
