import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  RoutePassengerManageCard,
  type RoutePassengerManageCardProps,
} from '@/components/route/route-passenger-manage-card';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export type ManagedPassenger = Pick<RoutePassengerManageCardProps, 'name' | 'avatarUrl'> & {
  id: string;
};

export type RoutePassengerListProps = {
  title?: string;
  passengers: ManagedPassenger[];
  capacity: number;
  onDeletePassengerPress: (passengerId: string) => void;
};

export function RoutePassengerList({
  title = 'Passageiros',
  passengers,
  capacity,
  onDeletePassengerPress,
}: RoutePassengerListProps) {
  const capacityText = `${passengers.length}/${capacity} da Capacidade`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.capacity}>{capacityText}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {passengers.map((passenger) => (
          <RoutePassengerManageCard
            key={passenger.id}
            name={passenger.name}
            avatarUrl={passenger.avatarUrl}
            onDeletePress={() => onDeletePassengerPress(passenger.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 415,
    minHeight: 235,
    alignSelf: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  header: {
    gap: 8,
    marginBottom: 16,
  },
  title: {
    ...typography.subtitle,
    color: colors.dark,
  },
  capacity: {
    ...typography.small,
    color: colors.subtleText,
  },
  listContent: {
    gap: 8,
  },
});
