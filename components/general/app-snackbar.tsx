import React from 'react';
import { StyleSheet } from 'react-native';
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
      {message}
    </Snackbar>
  );
}

const styles = StyleSheet.create({
  snackbar: {
    width: 344,
    borderRadius: 4,
    alignSelf: 'center',
    marginBottom: 16,
  },
  content: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: 48,
  },
});
