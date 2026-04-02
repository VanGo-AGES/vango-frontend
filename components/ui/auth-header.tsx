import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { typography } from '../../styles/typography';
import { colors } from '../../styles/colors';

type Props = {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
};

export default function AuthHeader({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
}: Props) {
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
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.dark} />
          </Pressable>
        </View>
      )}

      <Text style={styles.title}>{title}</Text>

      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },

  topRow: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  backButton: {
    padding: 8,
  },

  backButtonPressed: {
    opacity: 1,
  },

  title: {
    ...typography.header3,
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
