import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';

type CircleIconButtonProps = {
  icon: 'arrow-forward' | 'arrow-back';
  onPress: () => void;
  style?: ViewStyle;
};

export default function CircleIconButton({ icon, onPress, style }: CircleIconButtonProps) {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <Ionicons name={icon} size={24} color={colors.dark} />
    </Pressable>
  );
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
});
