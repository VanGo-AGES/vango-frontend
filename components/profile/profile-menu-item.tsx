import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps, ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import { colors, withAlpha } from '@/styles/colors';
import { typography } from '@/styles/typography';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

export type ProfileMenuItemProps = {
  label: string;
  icon: MaterialIconName;
  onPress?: () => void;
  isLast?: boolean;
};

export function ProfileMenuItem({
  label,
  icon,
  onPress,
  isLast = false,
}: ProfileMenuItemProps): ReactElement {
  return (
    <TouchableRipple
      onPress={onPress}
      rippleColor={withAlpha(colors.dark, 0.08)}
      borderless={false}
      style={[styles.button, !isLast && styles.withBorder]}
    >
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <MaterialIcons name={icon} size={20} color={colors.text} />
          <Text style={styles.label}>{label}</Text>
        </View>

        <MaterialIcons name="arrow-right" size={20} color={colors.text} />
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accent,
  },
  withBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  content: {
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  label: {
    ...typography.body,
    color: colors.dark,
    flexShrink: 1,
  },
});
