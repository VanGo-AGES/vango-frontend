import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Icon, Text } from 'react-native-paper';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import GenericAvatar from '@/assets/images/generic-avatar.svg';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

type HomeHeaderCardProps = {
  name: string;
  location?: string;
  avatarUri?: string;
  onProfilePress?: () => void;
  onSettingsPress?: () => void;
};

function AvatarPlaceholder() {
  return <GenericAvatar width={40} height={40} />;
}

export function HomeHeaderCard({
  name,
  location,
  avatarUri,
  onProfilePress,
  onSettingsPress,
}: HomeHeaderCardProps) {
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
        <Pressable
          onPress={onProfilePress}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Text style={styles.name}>{name}</Text>
        </Pressable>

        {location && (
          <View style={styles.locationRow}>
            <Icon source="map-marker-outline" size={16} color={colors.subtleText} />
            <Text style={styles.location}>{location}</Text>
          </View>
        )}
      </View>

      <Pressable
        onPress={onSettingsPress}
        style={({ pressed }) => [styles.settingsButton, { opacity: pressed ? 0.6 : 1 }]}
      >
        <MaterialIcons name="settings" size={24} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
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
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.subtleText,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
