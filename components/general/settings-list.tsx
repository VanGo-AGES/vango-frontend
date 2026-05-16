import type { ReactElement, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { SettingsListItem } from '@/components/general/settings-list-item';
import { colors } from '@/styles/colors';

export type SettingsListItemData = {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  onPress?: () => void;
  showChevron?: boolean;
};

export type SettingsListProps = {
  items: SettingsListItemData[];
};

export function SettingsList({ items }: SettingsListProps): ReactElement {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={item.id}>
          {index > 0 && <View style={styles.separator} />}
          <SettingsListItem
            icon={item.icon}
            title={item.title}
            description={item.description}
            onPress={item.onPress}
            showChevron={item.showChevron}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  separator: {
    height: 1,
    backgroundColor: colors.accent,
  },
});
