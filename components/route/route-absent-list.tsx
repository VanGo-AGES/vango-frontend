import { StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export type RouteAbsentItem = {
  id: string;
  name: string;
  reason?: string | null;
};

export type RouteAbsentListProps = {
  items: RouteAbsentItem[];
};

export function RouteAbsentList({ items }: RouteAbsentListProps) {
  if (!items.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          <MaterialIcons name="event-busy" size={20} color={colors.destructive} />
          <View style={styles.textWrapper}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            {item.reason ? (
              <Text style={styles.reason} numberOfLines={2}>
                {item.reason}
              </Text>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  textWrapper: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.body,
    color: colors.dark,
  },
  reason: {
    ...typography.small,
    color: colors.subtleText,
  },
});
