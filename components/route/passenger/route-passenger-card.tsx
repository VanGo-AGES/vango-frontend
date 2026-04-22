import { Image, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export type PassengerPhase = 'pre_trip' | 'pickup' | 'dropoff';

export type PassengerStatus =
  | 'confirmed'
  | 'absent'
  | 'none'
  | 'boarded'
  | 'next'
  | 'pending'
  | 'missed_pickup'
  | 'delivered'
  | 'missed_dropoff';

export type RoutePassengerCardProps = {
  name: string;
  avatarUrl?: string;
  phase: PassengerPhase;
  status?: PassengerStatus;
};

type StatusConfig = {
  label: string;
  color: string;
};

const STATUS_BY_PHASE: Record<
  PassengerPhase,
  Partial<Record<PassengerStatus, StatusConfig | null>>
> = {
  pre_trip: {
    confirmed: { label: 'Confirmado', color: colors.success },
    absent: { label: 'Ausente', color: colors.destructive },
    none: null,
  },
  pickup: {
    boarded: { label: 'Embarcado', color: colors.success },
    next: { label: 'Próximo', color: colors.dark },
    pending: { label: 'Pendente', color: colors.subtleText },
    missed_pickup: { label: 'Não embarcou', color: colors.destructive },
  },
  dropoff: {
    delivered: { label: 'Entregue', color: colors.success },
    next: { label: 'Próximo', color: colors.dark },
    pending: { label: 'Pendente', color: colors.subtleText },
    missed_dropoff: { label: 'Não entregue', color: colors.destructive },
  },
};

export function RoutePassengerCard({
  name,
  avatarUrl,
  phase,
  status = 'none',
}: RoutePassengerCardProps) {
  const statusConfig = STATUS_BY_PHASE[phase][status] ?? null;

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} resizeMode="cover" />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>

      {statusConfig ? (
        <Text style={[styles.status, { color: statusConfig.color }]} numberOfLines={1}>
          {statusConfig.label}
        </Text>
      ) : (
        <View style={styles.emptyStatusSpace} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    gap: 8,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    backgroundColor: colors.light,
  },
  name: {
    ...typography.body,
    color: colors.dark,
  },
  status: {
    ...typography.small,
  },
  emptyStatusSpace: {
    height: 20,
  },
});
