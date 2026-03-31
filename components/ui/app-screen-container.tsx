import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/styles/colors';

type Props = {
  children: React.ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
};

export function AppScreenContainer({ children, backgroundColor = colors.dark, style }: Props) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }, style]}>{children}</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
