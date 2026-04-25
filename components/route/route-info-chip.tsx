import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

type IconConfig = {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
};

type VariantConfig = {
  backgroundColor: string;
  icon?: IconConfig;
  formatLabel: (props: RouteInfoChipProps) => string;
};

export type RouteInfoChipProps = (
  | { variant: 'recurrence'; recurrence: string }
  | { variant: 'timeRange'; expectedTime: string; durationMinutes: number }
  | { variant: 'duration'; durationMinutes: number }
  | { variant: 'distance'; distanceKm: number }
) & { style?: StyleProp<ViewStyle> };

const variantConfig: Record<string, VariantConfig> = {
  recurrence: {
    backgroundColor: colors.primary,
    icon: { name: 'calendar', color: colors.dark },
    formatLabel: (props) => {
      if (props.variant !== 'recurrence') return '';
      return props.recurrence
        .split(',')
        .map((d) => d.charAt(0).toUpperCase() + d.slice(1))
        .join(' • ');
    },
  },
  timeRange: {
    backgroundColor: colors.light,
    formatLabel: (props) => {
      if (props.variant !== 'timeRange') return '';
      const [h, m] = props.expectedTime.split(':').map(Number);
      const totalMinutes = h * 60 + m + props.durationMinutes;
      const endH = String(Math.floor(totalMinutes / 60) % 24).padStart(2, '0');
      const endM = String(totalMinutes % 60).padStart(2, '0');
      return `${props.expectedTime}-${endH}:${endM}`;
    },
  },
  duration: {
    backgroundColor: colors.lightMuted,
    icon: { name: 'alarm', color: colors.dark },
    formatLabel: (props) => {
      if (props.variant !== 'duration') return '';
      const h = Math.floor(props.durationMinutes / 60);
      const m = props.durationMinutes % 60;
      return h > 0 ? `${h}h ${m}min` : `${m}min`;
    },
  },
  distance: {
    backgroundColor: colors.lightMuted,
    icon: { name: 'car-outline', color: colors.dark },
    formatLabel: (props) => (props.variant === 'distance' ? `${props.distanceKm}km` : ''),
  },
};

export function RouteInfoChip(props: RouteInfoChipProps) {
  const config = variantConfig[props.variant];
  const label = config.formatLabel(props);

  return (
    <View
      style={[styles.chip, styles.shadow, { backgroundColor: config.backgroundColor }, props.style]}
    >
      <View style={styles.content}>
        {config.icon && (
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={config.icon.name} size={18} color={config.icon.color} />
          </View>
        )}
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 32,
    borderRadius: 8,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 6,
  },
  iconContainer: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    ...typography.small,
    color: colors.dark,
  },
});
