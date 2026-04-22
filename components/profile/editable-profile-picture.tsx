import React, { useEffect, useState } from 'react';
import { View, Image, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GenericAvatar from '@/assets/images/generic-avatar.svg';
import { colors } from '@/styles/colors';

export interface EditableProfilePictureProps {
  imageUri?: string | null;
  size?: number;
  onImageChange?: (uri: string) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export function EditableProfilePicture({
  imageUri,
  size = 72,
  onImageChange,
  disabled = false,
  accessibilityLabel = 'Foto de perfil. Toque para editar.',
}: EditableProfilePictureProps) {
  const [localPhoto, setLocalPhoto] = useState<string | null>(imageUri ?? null);
  const [loading, setLoading] = useState(false);

  const photo = imageUri ?? localPhoto;

  useEffect(() => {
    if (imageUri) setLocalPhoto(imageUri);
  }, [imageUri]);

  const badgeSize = Math.max(24, Math.round(size * 0.32));
  const badgeIconSize = Math.round(size * 0.175);

  const requestPermission = async (source: 'camera' | 'gallery') => {
    try {
      const permissionRequest =
        source === 'camera'
          ? ImagePicker.requestCameraPermissionsAsync
          : ImagePicker.requestMediaLibraryPermissionsAsync;

      const { status } = await permissionRequest();

      if (status !== 'granted') {
        const message =
          source === 'camera'
            ? 'Precisamos de acesso à câmera para tirar a foto.'
            : 'Precisamos de acesso à sua galeria para escolher a foto.';

        Alert.alert('Permissão necessária', message);
        return false;
      }

      return true;
    } catch {
      Alert.alert('Erro', 'Não foi possível solicitar permissões.');
      return false;
    }
  };

  const handleImageResult = async (result: ImagePicker.ImagePickerResult) => {
    if (result.canceled || !result.assets?.[0]) return;

    const uri = result.assets[0].uri;

    setLoading(true);
    try {
      setLocalPhoto(uri);
      onImageChange?.(uri);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (source: 'camera' | 'gallery') => {
    const hasPermission = await requestPermission(source);
    if (!hasPermission) return;

    try {
      const picker =
        source === 'camera' ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;

      const result = await picker({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      await handleImageResult(result);
    } catch {
      Alert.alert(
        'Erro',
        source === 'camera'
          ? 'Não foi possível abrir a câmera.'
          : 'Não foi possível abrir a galeria.',
      );
    }
  };

  function handlePress() {
    if (disabled || loading) return;

    Alert.alert('Alterar foto', 'Escolha uma opção', [
      { text: 'Câmera', onPress: () => pickImage('camera') },
      { text: 'Galeria', onPress: () => pickImage('gallery') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Abre opções para alterar a foto de perfil"
      accessibilityState={{ disabled: disabled || loading }}
      style={({ pressed }) => [styles.root, pressed && !disabled && styles.rootPressed]}
    >
      <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
        {photo ? (
          <Image
            source={{ uri: photo }}
            style={{
              width: size,
              height: size,
              borderRadius: size / 2,
            }}
            resizeMode="cover"
          />
        ) : (
          <GenericAvatar width={size} height={size} />
        )}

        {loading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingBackdrop} />
            <ActivityIndicator size="small" color={colors.light} />
          </View>
        )}
      </View>

      <View
        style={[
          styles.badge,
          {
            width: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
          },
        ]}
        pointerEvents="none"
      >
        <MaterialCommunityIcons name="pencil" size={badgeIconSize} color={colors.dark} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'center',
  },
  rootPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
  avatar: {
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.dark,
    opacity: 0.35,
    borderRadius: 999,
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.light,
    elevation: 3,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.5,
  },
});
