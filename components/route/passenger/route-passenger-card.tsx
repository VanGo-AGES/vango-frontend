import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import GenericAvatar from '@/assets/images/generic-avatar.svg';
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
    boarded: { label: 'Embarcou', color: colors.success },
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
  const [imageError, setImageError] = useState(false);
  const statusConfig = STATUS_BY_PHASE[phase][status] ?? null;
  const showPlaceholder = !avatarUrl || imageError;

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrapper}>
        {showPlaceholder ? (
          <View style={styles.avatarPlaceholder}>
            <GenericAvatar width={100} height={100} />
          </View>
        ) : (
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatar}
            contentFit="cover"
            onError={() => setImageError(true)}
          />
        )}
      </View>

      <Text style={styles.name} numberOfLines={2}>
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
    gap: 4, //Ajustado para ter o mesmo valor do protótipo
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
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
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
