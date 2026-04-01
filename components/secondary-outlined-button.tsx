import { useState } from 'react';
import { Pressable, Text, StyleSheet, View, GestureResponderEvent } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/styles/colors';

type Props = {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
};

export default function SecondaryOutlinedButton({ label, onPress, disabled = false }: Props) {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.container, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <View style={styles.content}>
        <MaterialIcons name="arrow-forward" size={20} color={colors.dark} />
        <Text style={styles.text}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: colors.dark,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  pressed: {
    opacity: 0.6,
  },

  disabled: {
    opacity: 0.3,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  text: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark,
  },
});
