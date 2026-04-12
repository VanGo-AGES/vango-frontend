import { useState } from 'react';
import { Pressable, StyleSheet, Text as RNText, View } from 'react-native';
import { HelperText, Menu, TextInput } from 'react-native-paper';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export type RouteType = 'Ida' | 'Volta';

const ROUTE_TYPE_OPTIONS: RouteType[] = ['Ida', 'Volta'];

type RouteTypeSelectFieldProps = {
  value?: RouteType;
  onChange: (value: RouteType) => void;
  error?: string;
};

const INPUT_THEME = {
  colors: {
    onSurface: colors.dark,
    onSurfaceVariant: colors.subtleText,
    error: colors.destructive,
  },
};

export function RouteTypeSelectField({ value, onChange, error }: RouteTypeSelectFieldProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const hasError = !!error;

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleSelect = (option: RouteType) => {
    onChange(option);
    closeMenu();
  };

  return (
    <View style={styles.wrapper}>
      {/* Etiqueta posicionada sobre a borda superior */}
      <View style={styles.labelBadge}>
        <RNText style={[styles.labelText, hasError && styles.labelTextError]}>Tipo de Rota</RNText>
      </View>

      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <Pressable onPress={openMenu} accessibilityRole="combobox">
            <View pointerEvents="none">
              <TextInput
                value={value ?? ''}
                mode="outlined"
                editable={false}
                error={hasError}
                placeholder="Selecione"
                right={
                  hasError ? (
                    <TextInput.Icon icon="alert-circle" color={colors.destructive} />
                  ) : (
                    <TextInput.Icon icon="menu-down" />
                  )
                }
                style={styles.input}
                outlineColor={colors.dark}
                activeOutlineColor={colors.dark}
                outlineStyle={styles.outline}
                theme={INPUT_THEME}
              />
            </View>
          </Pressable>
        }
      >
        {ROUTE_TYPE_OPTIONS.map((option) => (
          <Menu.Item key={option} onPress={() => handleSelect(option)} title={option} />
        ))}
      </Menu>

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
