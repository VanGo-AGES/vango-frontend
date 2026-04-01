import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export interface ProfileSummaryCardUser {
  name: string;
  location: string;
  avatarUri?: string;
}

export interface ProfileSummaryCardProps {
  user?: ProfileSummaryCardUser;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_USER: ProfileSummaryCardUser = {
  name: 'João Silva',
  location: 'Porto Alegre, RS',
  avatarUri: undefined,
};

const AVATAR_SIZE = 56;

const Avatar: React.FC<{ uri?: string }> = ({ uri }) => {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={styles.avatarImage}
        accessibilityRole="image"
        accessibilityLabel="Foto de perfil"
      />
    );
  }
  return (
    <View style={styles.avatarPlaceholder} accessibilityLabel="Foto de perfil não disponível">
      <Icon name="account-circle" size={AVATAR_SIZE} color={colors.subtleText} />
    </View>
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

const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({ user, style }) => {
  const resolvedUser = user ?? DEFAULT_USER;
  return (
    <View style={[styles.card, style]} accessible accessibilityRole="none">
      <Avatar uri={resolvedUser.avatarUri} />
      <View style={styles.infoBlock}>
        <Text style={styles.nameText} numberOfLines={1}>
          {resolvedUser.name}
        </Text>
        <LocationRow location={resolvedUser.location} />
      </View>
    </View>
  );
};

export default ProfileSummaryCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 2,
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
    marginLeft: 16,
    justifyContent: 'center',
  },
  nameText: {
    ...typography.bodyBold,
    color: colors.dark,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    ...typography.small,
    color: colors.subtleText,
    flexShrink: 1,
  },
});
