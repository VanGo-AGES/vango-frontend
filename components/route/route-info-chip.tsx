import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export type RouteInfoChipVariant = 'recurrence' | 'timeRange' | 'duration' | 'distance';

export interface RouteInfoChipProps {
  variant: RouteInfoChipVariant;
  label: string;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function RouteInfoChip({ variant, label, icon, style }: RouteInfoChipProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'recurrence':
        return styles.bgPrimary;
      case 'timeRange':
        return styles.bgLight;
      case 'duration':
      case 'distance':
        return styles.bgAccentSolid;
      default:
        return styles.bgLight;
    }
  };

  return (
    <View style={[styles.chip, styles.shadowStandard, getVariantStyle(), style]}>
      <View style={styles.stateLayer}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowStandard: {
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  stateLayer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
    height: 32,
  },
  bgPrimary: {
    backgroundColor: colors.primary,
  },
  bgLight: {
    backgroundColor: colors.light,
  },
  bgAccentSolid: {
    backgroundColor: '#E1E3E4',
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
    lineHeight: 20,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
});
