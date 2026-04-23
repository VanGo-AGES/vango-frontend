import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Icon } from 'react-native-paper';

import GenericAvatar from '@/assets/images/generic-avatar.svg';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export type RoutePassengerManageCardProps = {
  name: string;
  avatarUrl?: string;
  onDeletePress: () => void;
};

export function RoutePassengerManageCard({
  name,
  avatarUrl,
  onDeletePress,
}: RoutePassengerManageCardProps) {
  const [imageError, setImageError] = useState(false);

  const showPlaceholder = !avatarUrl || imageError;

  return (
    <View style={styles.card}>
      <Pressable
        onPress={onDeletePress}
        accessibilityRole="button"
        accessibilityLabel={`Remover passageiro ${name}`}
        style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
      >
        <Icon source="delete-outline" size={20} color={colors.destructive} />
      </Pressable>

      <View style={styles.avatarContainer}>
        {showPlaceholder ? (
          <View style={[styles.avatar, styles.avatarFallback]}>
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

      <Text numberOfLines={1} style={styles.name}>
        {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 102,
    height: 135, //Adicionado pra limitar a altura
    borderRadius: 8,
    backgroundColor: 'transparent', // Tava com uma cor cinza
    //paddingHorizontal: 12,
    paddingTop: 12,
    //paddingBottom: 12,
    //alignItems: 'center',
    gap: 4,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    opacity: 0.75,
  },
  deleteButtonPressed: {
    opacity: 0.7,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    //marginTop: 8, 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  avatarFallback: {
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...typography.body,
    color: colors.dark,
    textAlign: 'left',
    width: '100%',
  },
});
