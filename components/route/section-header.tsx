import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { typography } from '@/styles/typography';
import { colors, withAlpha } from '@/styles/colors';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
};

export function SectionHeader({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
}: SectionHeaderProps) {
  const router = useRouter();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    router.back();
  };

  return (
    <View style={styles.container}>
      {showBackButton && (
        <View style={styles.topRow}>
          <Pressable
            onPress={handleBackPress}
            accessibilityRole="button"
            accessibilityLabel="voltar"
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.dark} />
          </Pressable>
        </View>
      )}

      <Text style={styles.title}>{title}</Text>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
  },

  topRow: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: withAlpha(colors.light, 0.5),
    alignItems: 'center',
    justifyContent: 'center',
  },

  backButtonPressed: {
    opacity: 0.6,
  },

  title: {
    ...typography.subtitle,
    color: colors.dark,
    textAlign: 'center',
  },

  subtitle: {
    ...typography.body,
    color: colors.dark,
    textAlign: 'center',
    marginTop: 4,
  },
});
