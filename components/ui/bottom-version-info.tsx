import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

interface BottomVersionInfoProps {
  theme?: 'light' | 'dark';
  version?: string;
  brandName?: string;
}

export function BottomVersionInfo({
  theme,
  version = 'V1.0',
  brandName = 'VanGO',
}: BottomVersionInfoProps) {
  const systemScheme = useColorScheme();
  const scheme = theme ?? systemScheme ?? 'light';
  const isDark = scheme === 'dark';

  const brandColor = isDark ? colors.primary : colors.dark;

  return (
    <View style={[styles.container]}>
      <View style={styles.row}>
        <Text style={[typography.small, { color: brandColor }]}>{brandName}</Text>
        <Text style={[typography.small, { color: brandColor }]}>{version}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
    height: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
});
