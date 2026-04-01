import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Icon, Text } from 'react-native-paper';
import GenericAvatar from '@/assets/images/generic-avatar.svg';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

type HomeHeaderCardProps = {
  name: string;
  location: string;
  avatarUri?: string;
};

function AvatarPlaceholder() {
  return <GenericAvatar width={40} height={40} />;
}

export function HomeHeaderCard({ name, location, avatarUri }: HomeHeaderCardProps) {
  const [imageError, setImageError] = useState(false);

  const showPlaceholder = !avatarUri || imageError;

  return (
    <View style={styles.container}>
      {showPlaceholder ? (
        <AvatarPlaceholder />
      ) : (
        <Image
          source={{ uri: avatarUri }}
          style={styles.avatar}
          onError={() => setImageError(true)}
        />
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>

        <View style={styles.locationRow}>
          <Icon source="map-marker-outline" size={16} color={colors.subtleText} />
          <Text style={styles.location}>{location}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  info: {
    justifyContent: 'space-between',
    height: 40,
  },
  name: {
    ...typography.body,
    color: colors.dark,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  location: {
    ...typography.caption,
    color: colors.subtleText,
  },
});
