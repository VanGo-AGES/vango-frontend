import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import GenericAvatar from '@/assets/images/generic-avatar.svg';
import { useSessionStore } from '@/store/session.store';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export interface ProfileSummaryCardUser {
  name: string;
  location?: string;
  avatarUri?: string;
}

export interface ProfileSummaryCardProps {
  user?: ProfileSummaryCardUser;
  style?: StyleProp<ViewStyle>;
}

const AVATAR_SIZE = 60;

const Avatar: React.FC<{ uri?: string }> = ({ uri }) => {
  const [imageError, setImageError] = useState(false);
  const showPlaceholder = !uri || imageError;

  if (showPlaceholder) {
    return (
      <View style={styles.avatarPlaceholder} accessibilityLabel="Foto de perfil não disponível">
        <GenericAvatar width={AVATAR_SIZE} height={AVATAR_SIZE} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={styles.avatarImage}
      accessibilityRole="image"
      accessibilityLabel="Foto de perfil"
      onError={() => setImageError(true)}
    />
  );
};

const LocationRow: React.FC<{ location: string }> = ({ location }) => (
  <View style={styles.locationRow}>
    <Icon name="map-marker-outline" size={16} color={colors.subtleText} />
    <Text style={styles.locationText} numberOfLines={1}>
      {location}
    </Text>
  </View>
);

export function ProfileSummaryCard({ user, style }: ProfileSummaryCardProps) {
  const sessionUser = useSessionStore((s) => s.user);
  const localPhotoUri = useSessionStore((s) => s.localPhotoUri);

  const resolvedUser: ProfileSummaryCardUser = user ?? {
    name: sessionUser?.name ?? '',
    avatarUri: localPhotoUri ?? sessionUser?.photo_url ?? undefined,
  };

  return (
    <View style={[styles.card, style]} accessible accessibilityRole="none">
      <Avatar uri={resolvedUser.avatarUri} />
      <View style={styles.infoBlock}>
        <Text style={styles.nameText} numberOfLines={1}>
          {resolvedUser.name}
        </Text>
        {resolvedUser.location && <LocationRow location={resolvedUser.location} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 2,
    gap: 24,
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: colors.accent,
  },
  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  infoBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    ...typography.subtitle,
    color: colors.dark,
    marginTop: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    ...typography.body,
    color: colors.subtleText,
    flexShrink: 1,
  },
});
