import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ComponentProps, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

interface AppTextFieldProps extends Omit<ComponentProps<typeof TextInput>, 'placeholderTextColor'> {
  label: string;
  error?: string;
}

export function AppTextField({ label, error, style, ...props }: AppTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {/* Floating label with yellow background, always positioned over the border */}
      <View style={styles.labelContainer}>
        <Text style={[styles.labelText, error ? styles.labelTextError : null]}>{label}</Text>
      </View>

      {/* Border container + input + error icon */}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error ? styles.inputContainerError : null,
        ]}
      >
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.subtleText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {error && (
          <MaterialIcons name="error" size={24} color={colors.error} style={styles.errorIcon} />
        )}
      </View>

      {/* Error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    marginTop: 12,
  },
  labelContainer: {
    position: 'absolute',
    top: -8,
    left: 12,
    zIndex: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 4,
  },
  labelText: {
    ...typography.small,
    color: colors.dark,
  },
  labelTextError: {
    color: colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderColor: colors.subtleText,
    borderRadius: 4,
    paddingHorizontal: 16,
  },
  inputContainerFocused: {
    borderColor: colors.subtleText,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.dark,
  },
  errorIcon: {
    marginLeft: 8,
  },
  errorText: {
    ...typography.small,
    color: colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
});
