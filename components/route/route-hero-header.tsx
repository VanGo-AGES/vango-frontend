import {
  ImageBackground,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { RouteInfoChip } from '@/components/route/route-info-chip';

export type RouteHeroHeaderProps = {
  routeName: string;
  recurrence: string;
  expectedTime: string;
  durationMinutes: number;
  distanceKm: number;
  backgroundImage?: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_MAP_IMAGE = require('@/assets/images/map-mock.png');

export function RouteHeroHeader({
  routeName,
  recurrence,
  expectedTime,
  durationMinutes,
  distanceKm,
  backgroundImage = DEFAULT_MAP_IMAGE,
  style,
}: RouteHeroHeaderProps) {
  return (
    <ImageBackground
      source={backgroundImage}
      style={[styles.container, style]}
      imageStyle={styles.image}
    >
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="darkGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.light} stopOpacity="0" />
            <Stop offset="0.2823" stopColor={colors.dark} stopOpacity="0.25" />
            <Stop offset="1" stopColor={colors.dark} stopOpacity="0.5" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#darkGradient)" />
      </Svg>

      <View style={styles.content}>
        <Text
          style={styles.title}
          numberOfLines={2}
          accessibilityRole="header"
          accessibilityLabel={routeName}
        >
          {routeName}
        </Text>

        <RouteInfoChip variant="recurrence" recurrence={recurrence} />

        <View style={styles.metricsRow}>
          <RouteInfoChip
            variant="timeRange"
            expectedTime={expectedTime}
            durationMinutes={durationMinutes}
          />
          <RouteInfoChip variant="duration" durationMinutes={durationMinutes} />
          <RouteInfoChip variant="distance" distanceKm={distanceKm} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 260,
    justifyContent: 'flex-end',
  },
  image: {
    backgroundColor: colors.light,
  },
  content: {
    padding: 16,
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    ...typography.header2,
    color: colors.light,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
