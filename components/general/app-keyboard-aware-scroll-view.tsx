import { ReactNode } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-controller';

type Props = KeyboardAwareScrollViewProps & {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * ScrollView que rola automaticamente o campo focado para acima do teclado,
 * com o mesmo comportamento em iOS e Android.
 *
 * Centraliza os defaults do projeto para que cada tela só precise trocar o
 * container de scroll (sem KeyboardAvoidingView nem checagens de plataforma).
 */
export function AppKeyboardAwareScrollView({
  children,
  contentContainerStyle,
  bottomOffset = 24,
  ...props
}: Props) {
  return (
    <KeyboardAwareScrollView
      bottomOffset={bottomOffset}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      {...props}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
});
