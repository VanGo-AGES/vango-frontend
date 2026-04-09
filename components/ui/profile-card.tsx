import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

import { CircleIconButton } from './circle-icon-button';

export type ProfileCardVariant = 'motorista' | 'passageiro';

const CARD_CONTENT: Record<ProfileCardVariant, { title: string; description: string }> = {
  motorista: {
    title: 'Motorista',
    description: 'Crie rotas, gerencie passageiros e acompanhe suas viagens.',
  },
  passageiro: {
    title: 'Passageiro',
    description: 'Entre em rotas, acompanhe o trajeto e receba notificações.',
  },
};

export type ProfileCardProps = {
  variant: ProfileCardVariant;
  onPress: () => void;
  imageUri?: string;
  style?: StyleProp<ViewStyle>;
};

export function ProfileCard({ variant, onPress, imageUri, style }: ProfileCardProps) {
  const content = CARD_CONTENT[variant];

  return (
    <View style={[styles.card, style]}>
      <View style={styles.imagePlaceholder}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        ) : null}
      </View>

      <View style={styles.footer}>
        <View style={styles.copyContainer}>
          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.description}>{content.description}</Text>
        </View>

        <CircleIconButton
          icon="arrow-forward"
          onPress={onPress}
          accessibilityLabel={`ir para modo ${variant}`}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.dark,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16,
  },
  imagePlaceholder: {
    height: 125,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.dark,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  copyContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...typography.bodyBold,
    color: colors.dark,
  },
  description: {
    ...typography.small,
    color: colors.text,
    lineHeight: 21,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 100,
  },
});
