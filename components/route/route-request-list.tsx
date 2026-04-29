import { StyleSheet, View } from 'react-native';

import { RouteRequestItem } from '@/components/route/route-request-item';
import { colors } from '@/styles/colors';

export type RouteRequest = {
  id: string;
  name: string;
  avatarUrl?: string;
  guardianName?: string;
  checked?: boolean;
};

export type RouteRequestListProps = {
  requests: RouteRequest[];
  onCheckRequestPress: (requestId: string) => void;
  onRemoveRequestPress: (requestId: string) => void;
};

export function RouteRequestList({
  requests,
  onCheckRequestPress,
  onRemoveRequestPress,
}: RouteRequestListProps) {
  return (
    <View style={styles.container}>
      {requests.map((request, index) => (
        <View key={request.id}>
          {index > 0 && <View style={styles.separator} />}
          <RouteRequestItem
            name={request.name}
            avatarUrl={request.avatarUrl}
            guardianName={request.guardianName}
            checked={request.checked}
            onCheckPress={() => onCheckRequestPress(request.id)}
            onRemovePress={() => onRemoveRequestPress(request.id)}
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
