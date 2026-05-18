import { useState } from 'react';
import { View, Button } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  PassengerTripBottomSheet,
  PassengerTripSheetState,
} from '@/components/route/passenger/passenger-trip-bottom-sheet';

const DRIVER = {
  id: '1',
  name: 'João Silva',
  plate: 'ABC-123',
};

export default function TestScreen() {
  const [state, setState] = useState<PassengerTripSheetState>('driver_on_the_way');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16, gap: 8 }}>
        <Button title="driver_on_the_way" onPress={() => setState('driver_on_the_way')} />
        <Button title="driver_arrived" onPress={() => setState('driver_arrived')} />
        <Button title="on_board" onPress={() => setState('on_board')} />
      </View>

      <PassengerTripBottomSheet
        state={state}
        driver={DRIVER}
        timeRemaining={18}
        estimatedArrival="19h01"
        distance="3.5km"
        countdownSeconds={120}
      />
    </GestureHandlerRootView>
  );
}
