import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { typography } from '../../styles/typography';
import { colors } from '../../styles/colors';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
};

export default function SectionHeader({
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
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.dark} />
          </TouchableOpacity>
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
    paddingVertical: 8,
    paddingHorizontal: 4,
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
