import { StyleSheet, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Icon } from 'react-native-paper';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

interface SubtleOutlinedButtonProps {
  label: string;
  icon?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SubtleOutlinedButton({ label, icon, onPress, style }: SubtleOutlinedButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      {icon && <Icon source={icon} size={20} color={colors.subtleText} />}
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.subtleText,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
    backgroundColor: 'transparent',
  },
  text: {
    ...typography.buttonText,
    color: colors.subtleText,
  },
});
