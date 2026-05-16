import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ReactElement, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import { colors, withAlpha } from '@/styles/colors';
import { typography } from '@/styles/typography';

export type SettingsListItemProps = {
  icon: ReactNode;
  title: string;
  description: string;
  onPress?: () => void;
  showChevron?: boolean;
};

export function SettingsListItem({
  icon,
  title,
  description,
  onPress,
  showChevron = false,
}: SettingsListItemProps): ReactElement {
  return (
    <TouchableRipple
      onPress={onPress}
      rippleColor={withAlpha(colors.dark, 0.08)}
      borderless={false}
      disabled={!onPress}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.iconWrapper}>{icon}</View>
        
        <View style={styles.textContent}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {showChevron && (
          <View style={styles.chevronWrapper}>
            <MaterialIcons name="arrow-forward" size={20} color={colors.dark} />
          </View>
        )}
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light,
  },
  content: {
    flexDirection: 'row',
    paddingVertical: 12, 
    paddingHorizontal: 16,
    gap: 16,
    minHeight: 88, 
  },
  iconWrapper: {
    justifyContent: 'flex-start',
  },
  textContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  chevronWrapper: {
    justifyContent: 'flex-start', 
    alignItems: 'center',
  },
  title: {
    ...typography.bodyLarge,
    color: colors.dark,
  },
  description: {
    ...typography.bodyMedium,
    color: colors.subtleText,
  },
});
