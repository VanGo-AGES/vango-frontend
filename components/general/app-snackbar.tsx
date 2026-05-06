import { colors } from '@/styles/colors';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Snackbar } from 'react-native-paper';

export type AppSnackbarProps = {
  visible: boolean;
  message: string;
  onDismiss: () => void;
};

export function AppSnackbar({ visible, message, onDismiss }: AppSnackbarProps) {
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={3000}
      style={styles.snackbar}
      contentStyle={styles.content}
    >
      <Text style={{ color: colors.white }} numberOfLines={1}>
        {message}
      </Text>
    </Snackbar>
  );
}

const styles = StyleSheet.create({
  snackbar: {
    width: 344,
    borderRadius: 4,
    alignSelf: 'center',
    marginBottom: 16,
    backgroundColor: colors.snackbar,
  },
  content: {
    minHeight: 16,
  },
});
