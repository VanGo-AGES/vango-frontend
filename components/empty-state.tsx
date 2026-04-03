import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps, ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

type MaterialIconName = ComponentProps<typeof MaterialIcons>['name'];

export type EmptyStateProps = {
  icon: MaterialIconName;
  text: string;
};

export function EmptyState({ icon, text }: EmptyStateProps): ReactElement {
  return (
    <View style={styles.container}>
      <MaterialIcons name={icon} size={24} color={colors.subtleText} />

      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light,
    borderRadius: 8,

    paddingHorizontal: 16,
    paddingVertical: 16,

    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    ...typography.body,
    color: colors.subtleText,
    textAlign: 'center',
  },
});
