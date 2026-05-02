import { Portal, Snackbar } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { colors } from '@/styles/colors';

export type AppSnackbarProps = {
  visible: boolean;
  message: string;
  duration?: number;
  onDismiss: () => void;
};

export function AppSnackbar({ visible, message, duration = 3000, onDismiss }: AppSnackbarProps) {
  return (
    <Portal>
      <Snackbar
        visible={visible}
        onDismiss={onDismiss}
        duration={duration}
        style={styles.snackbar}
        wrapperStyle={styles.wrapper}
        theme={{ colors: { inverseSurface: colors.dark, inverseOnSurface: colors.white } }}
      >
        {message}
      </Snackbar>
    </Portal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  snackbar: {
    backgroundColor: colors.dark,
    borderRadius: 8,
  },
});
