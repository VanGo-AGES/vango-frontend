import { ComponentProps } from 'react';
import { StyleSheet, Text as RNText, View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

const INPUT_THEME = {
  colors: {
    onSurface: colors.dark,
    onSurfaceVariant: colors.subtleText,
    error: colors.destructive,
  },
};

type AppTextFieldProps = Omit<ComponentProps<typeof TextInput>, 'error'> & {
  label: string;
  error?: string;
};

export function AppTextField({ label, error, style, ...props }: AppTextFieldProps) {
  const hasError = !!error;

  return (
    <View style={styles.wrapper}>
      {/* Etiqueta posicionada sobre a borda superior */}
      <View style={styles.labelBadge}>
        <RNText style={[styles.labelText, hasError && styles.labelTextError]}>{label}</RNText>
      </View>

      <TextInput
        mode="outlined"
        error={hasError}
        right={
          hasError ? <TextInput.Icon icon="alert-circle" color={colors.destructive} /> : undefined
        }
        style={[styles.input, style]}
        outlineColor={colors.dark}
        activeOutlineColor={colors.dark}
        outlineStyle={styles.outline}
        theme={INPUT_THEME}
        {...props}
      />

      {hasError && (
        <HelperText type="error" style={styles.errorText}>
          {error}
        </HelperText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 8,
  },
  labelBadge: {
    position: 'absolute',
    top: -9,
    left: 12,
    zIndex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  labelText: {
    ...typography.caption,
    color: colors.dark,
  },
  labelTextError: {
    color: colors.destructive,
  },
  input: {
    backgroundColor: colors.light,
  },
  outline: {
    borderWidth: 1,
  },
  errorText: {
    marginTop: -4,
  },
});
