import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

type TripDetailsCardVariant = 'passenger' | 'driver' | 'address';

interface TripDetailsCardProps {
  variant: TripDetailsCardVariant;
  label: string;
  name?: string;
  avatarUrl?: string;
  plate?: string;
  address?: string;
}

export function TripDetailsCard({
  variant,
  label,
  name,
  avatarUrl,
  plate,
  address,
}: TripDetailsCardProps) {
  const renderContent = () => {
    switch (variant) {
      case 'passenger':
      case 'driver':
        return (
          <View style={styles.contentRow}>
            <View style={styles.userInfo}>
              {avatarUrl ? (
                <Avatar.Image size={40} source={{ uri: avatarUrl }} />
              ) : (
                <Avatar.Icon size={40} icon="account" style={styles.avatarPlaceholder} />
              )}
              <Text style={styles.userName} numberOfLines={1}>
                {name}
              </Text>
            </View>
            {variant === 'driver' && plate && (
              <View style={styles.plateBadge}>
                <Text style={styles.plateText}>{plate}</Text>
              </View>
            )}
          </View>
        );

      case 'address':
        return (
          <View style={styles.contentRow}>
            <View style={styles.addressInfo}>
              <MaterialCommunityIcons name="map-marker" size={40} color={colors.dark} />
              <Text style={styles.addressText} numberOfLines={2}>
                {address}
              </Text>
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.card}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 10,
  },
  label: {
    ...typography.preTitle,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 13,
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  userName: {
    ...typography.subtitle,
    color: colors.dark,
    flexShrink: 1,
  },
  avatarPlaceholder: {
    backgroundColor: colors.subtleText,
  },
  plateBadge: {
    backgroundColor: colors.light,
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plateText: {
    ...typography.bodyBold,
    color: colors.dark,
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  addressText: {
    ...typography.body,
    color: colors.dark,
    flexShrink: 1,
  },
});
