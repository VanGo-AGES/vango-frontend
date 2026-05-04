import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { RouteStopItem } from '@/components/route/route-stop-item';
import { colors } from '@/styles/colors';

export type Stop = {
  id: string;
  type: 'origin' | 'stop' | 'destination';
  passengerName?: string;
  address: string;
};

export type RouteStopListProps = {
  stops: Stop[];
  currentStopId?: string;
  onDeleteStopPress?: (stopId: string) => void;
};

export function RouteStopList({ stops, currentStopId, onDeleteStopPress }: RouteStopListProps) {
  let stopCounter = 0;
  const indexedStops = stops.map((stop) => {
    if (stop.type === 'stop') {
      stopCounter += 1;
      return { ...stop, stopNumber: stopCounter };
    }
    return stop;
  });

  return (
    <View>
      {indexedStops.map((stop) => {
        const isCurrent = stop.id === currentStopId;
        const item = (
          <RouteStopItem
            variant={stop.type}
            subtitle={stop.address}
            isCurrent={isCurrent}
            stopNumber={'stopNumber' in stop ? stop.stopNumber : undefined}
            passengerName={stop.passengerName}
          />
        );

        if (stop.type === 'stop' && onDeleteStopPress) {
          return (
            <ReanimatedSwipeable
              key={stop.id}
              friction={2}
              rightThreshold={40}
              overshootRight={false}
              renderRightActions={() => <DeleteAction onPress={() => onDeleteStopPress(stop.id)} />}
            >
              {item}
            </ReanimatedSwipeable>
          );
        }

        return <View key={stop.id}>{item}</View>;
      })}
    </View>
  );
}

function DeleteAction({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Excluir parada"
      style={({ pressed }) => [styles.deleteAction, pressed && styles.deleteActionPressed]}
    >
      <MaterialIcons name="delete" size={24} color={colors.light} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  deleteAction: {
    width: 80,
    backgroundColor: colors.destructive,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteActionPressed: {
    opacity: 0.8,
  },
});
