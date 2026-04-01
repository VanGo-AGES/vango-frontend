import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { typography } from '../../styles/typography';
import { colors } from '../../styles/colors';

type Props = {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
};

export default function AuthHeader({ title, subtitle, showBackButton = false }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {showBackButton && (
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.dark} />
          </TouchableOpacity>
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
