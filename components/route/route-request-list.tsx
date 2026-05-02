import { StyleSheet, View } from 'react-native';

import { RouteRequestItem } from '@/components/route/route-request-item';

export type RouteRequest = {
  id: string;
  name: string;
  avatarUrl?: string;
  guardianName?: string;
};

export type RouteRequestListProps = {
  requests: RouteRequest[];
  onApprovePress: (id: string) => void;
  onRemovePress: (id: string) => void;
};

export function RouteRequestList({
  requests,
  onApprovePress,
  onRemovePress,
}: RouteRequestListProps) {
  return (
    <View style={styles.container}>
      {requests.map((request) => (
        <RouteRequestItem
          key={request.id}
          name={request.name}
          avatarUrl={request.avatarUrl}
          guardianName={request.guardianName}
          checked={false}
          onCheckPress={() => onApprovePress(request.id)}
          onRemovePress={() => onRemovePress(request.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
});
