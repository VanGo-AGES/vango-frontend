import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState, type ReactElement } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import GenericAvatar from '@/assets/images/generic-avatar.svg';
import { colors, withAlpha } from '@/styles/colors';
import { typography } from '@/styles/typography';

const AVATAR_SIZE = 48;

export type RouteRequestItemProps = {
  name: string;
  avatarUrl?: string;
  guardianName?: string;
  checked?: boolean;
  onCheckPress: () => void;
  onRemovePress: () => void;
};

export function RouteRequestItem({
  name,
  avatarUrl,
  guardianName,
  checked = false,
  onCheckPress,
  onRemovePress,
}: RouteRequestItemProps): ReactElement {
  // Se a URL do avatar falhar no carregamento, cai pro placeholder SVG.
  // Reset quando a URL mudar pra dar nova chance de tentar carregar.
  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    setImageError(false);
  }, [avatarUrl]);

  const showAvatarImage = !!avatarUrl && !imageError;

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showAvatarImage ? (
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatar}
            accessibilityRole="image"
            accessibilityLabel={`Foto de ${name}`}
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.avatarFallback} accessibilityLabel="Foto de perfil não disponível">
            <GenericAvatar width={AVATAR_SIZE} height={AVATAR_SIZE} />
          </View>
        )}

        <View style={styles.textContent}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>

          {!!guardianName && (
            <Text style={styles.guardian} numberOfLines={1}>
              Responsável: {guardianName}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableRipple
          onPress={onRemovePress}
          rippleColor={withAlpha(colors.destructive, 0.12)}
          style={styles.removeButton}
          accessibilityRole="button"
          accessibilityLabel={`Remover solicitação de ${name}`}
        >
          <Text style={styles.removeText}>Remover</Text>
        </TouchableRipple>

        <TouchableRipple
          onPress={onCheckPress}
          rippleColor={withAlpha(colors.secondary, 0.16)}
          style={[styles.checkbox, checked && styles.checkboxChecked]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked }}
          accessibilityLabel={`Aceitar solicitação de ${name}`}
        >
          <View style={styles.checkboxContent}>
            {checked && <MaterialIcons name="check" size={16} color={colors.light} />}
          </View>
        </TouchableRipple>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    backgroundColor: colors.light,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 12,
    backgroundColor: colors.accent,
  },

  avatarFallback: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 12,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  textContent: {
    flex: 1,
    justifyContent: 'center',
  },

  name: {
    ...typography.bodyLarge,
    color: colors.dark,
  },

  guardian: {
    ...typography.bodyMedium,
    color: colors.subtleText,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginLeft: 16,
  },

  removeButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },

  removeText: {
    ...typography.labelSmall,
    color: colors.destructive,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.subtleText,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },

  checkboxContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
