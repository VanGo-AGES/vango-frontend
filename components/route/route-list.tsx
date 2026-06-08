import { FlatList, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { RouteItem, RouteItemProps } from '@/components/route/route-item';

export type RouteListProps = {
  routes: RouteItemProps[];
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export function RouteList({ routes, style, contentContainerStyle }: RouteListProps) {
  return (
    <FlatList
      data={routes}
      keyExtractor={(_, index) => String(index)}
      renderItem={({ item }) => <RouteItem {...item} />}
      style={style}
      contentContainerStyle={[styles.container, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 16,
  },
});
