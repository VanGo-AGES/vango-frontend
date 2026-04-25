import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

type RouteStopItemProps = {
  variant?: 'origin' | 'stop' | 'destination';
  subtitle: string;
  title?: string;
  isCurrent?: boolean;
  stopNumber?: number;
  passengerName?: string;
};

export function RouteStopItem({
  variant = 'origin',
  subtitle,
  title,
  isCurrent = false,
  stopNumber,
  passengerName,
}: RouteStopItemProps) {
  const defaultTitles = {
    origin: 'Origem',
    destination: 'Destino',
    stop: stopNumber && passengerName ? `Parada ${stopNumber} - ${passengerName}` : 'Parada',
  };

  const resolvedTitle = title ?? defaultTitles[variant];
  const iconName = variant === 'stop' ? 'map-marker-outline' : 'map-marker';

  return (
    <View style={[styles.container, { backgroundColor: isCurrent ? colors.accent : colors.light }]}>
      <MaterialCommunityIcons name={iconName} size={24} color={colors.dark} />
      <View>
        <Text style={styles.title}>{resolvedTitle}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
  },
  title: {
    ...typography.bodyLarge,
    color: colors.dark,
    marginTop: 8,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.dark,
    marginBottom: 8,
  },
});
