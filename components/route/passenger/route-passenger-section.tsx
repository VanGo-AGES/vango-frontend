import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  RoutePassengerCard,
  type PassengerPhase,
  type RoutePassengerCardProps,
} from '@/components/route/passenger/route-passenger-card';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export type RoutePassengerSectionProps = {
  title?: string;
  passengers: Omit<RoutePassengerCardProps, 'phase'>[];
  phase: PassengerPhase;
};

export function RoutePassengerSection({ title, passengers, phase }: RoutePassengerSectionProps) {
  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.passengerList}
      >
        {passengers.map((passenger, index) => (
          <RoutePassengerCard key={`${passenger.name}-${index}`} {...passenger} phase={phase} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8,
  },
  title: {
    ...typography.bodyBold,
    color: colors.dark,
  },
  passengerList: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
});
