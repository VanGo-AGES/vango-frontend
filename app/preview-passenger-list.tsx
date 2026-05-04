import { StyleSheet, View } from 'react-native';

import { AppScreenContainer } from '@/components/general/app-screen-container';
import { RoutePassengerList } from '@/components/route/passenger/route-passenger-list';
import { colors } from '@/styles/colors';

const MOCK_PASSENGERS = [
  { id: '1', name: 'Bernardo' },
  { id: '2', name: 'Júlia' },
  { id: '3', name: 'Mateus' },
  { id: '4', name: 'Nicole' },
  { id: '5', name: 'Carlos' },
];

export default function PreviewPassengerListScreen() {
  return (
    <AppScreenContainer backgroundColor={colors.light} style={styles.container}>
      <View style={styles.wrapper}>
        <RoutePassengerList
          passengers={MOCK_PASSENGERS}
          capacity={20}
          onDeletePassengerPress={() => {}}
        />
      </View>
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    justifyContent: 'center',
  },
  wrapper: {
    backgroundColor: colors.white,
  },
});
