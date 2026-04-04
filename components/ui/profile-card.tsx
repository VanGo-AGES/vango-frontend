import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

import { CircleIconButton } from './circle-icon-button';

export type ProfileCardVariant = 'motorista' | 'passageiro';

type ProfileCardProps = {
  variant: ProfileCardVariant;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

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

export function ProfileCard({ variant, onPress, style }: ProfileCardProps) {
  const content = CARD_CONTENT[variant];

  return (
    <View style={[styles.card, style]}>
      <View style={styles.imagePlaceholder} />

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
    width: 300,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark,
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 8,
  },
  imagePlaceholder: {
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.dark,
    backgroundColor: 'transparent',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
  },
  copyContainer: {
    flex: 1,
    gap: 2,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    marginBottom: 2,
  },
});
