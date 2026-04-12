import { View, Text, StyleSheet, useColorScheme, ViewStyle, StyleProp } from 'react-native';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import Constants from 'expo-constants';

export interface BottomVersionInfoProps {
  theme?: 'light' | 'dark';
  style?: StyleProp<ViewStyle>;
  brandName?: string;
}

export function BottomVersionInfo({ theme, style, brandName = 'VanGO' }: BottomVersionInfoProps) {
  const systemScheme = useColorScheme();
  const scheme = theme ?? systemScheme ?? 'light';
  const isDark = scheme === 'dark';

  const brandColor = isDark ? colors.primary : colors.dark;
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <View style={style}>
      <View style={styles.row}>
        <Text style={[typography.small, { color: brandColor }]}>{brandName}</Text>
        <Text style={[typography.small, { color: brandColor }]}>{version}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
