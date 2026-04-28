import { ReactNode } from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/styles/colors';

type Props = {
  children: ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
  edges?: Edge[];
};

export function AppScreenContainer({
  children,
  backgroundColor = colors.light,
  style,
  edges = ['top', 'right', 'bottom', 'left'],
}: Props) {
  return (
    <SafeAreaView edges={edges} style={[styles.container, { backgroundColor }, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
