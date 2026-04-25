import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

type NextRouteCardProps = {
  routeName: string;
  dateLabel: string;
  time: string;
  onPress?: () => void;
};

export function NextRouteCard({ routeName, dateLabel, time, onPress }: NextRouteCardProps) {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/map-mock.png')}
        style={styles.card}
        imageStyle={styles.cardImage}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(0,0,0,0.5)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.overlay}
        >
          <Text style={styles.routeName}>{routeName}</Text>

          <View style={styles.chipsContainer}>
            <View style={[styles.chip, styles.dateChip]}>
              <MaterialIcons name="calendar-month" size={12} color={colors.dark} />
              <Text style={styles.chipText}>{dateLabel}</Text>
            </View>

            <View style={[styles.chip, styles.timeChip]}>
              <Text style={styles.chipText}>{time}</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>

      <Pressable style={styles.cta} onPress={onPress}>
        <MaterialIcons name="arrow-forward" size={14} color={colors.secondary} />
        <Text style={styles.ctaText}>Ver Rota</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  card: {
    height: 205,
    borderRadius: 28,
    overflow: 'hidden',
  },
  cardImage: {
    borderRadius: 28,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  routeName: {
    ...typography.header3,
    color: colors.white,
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    minHeight: 28,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dateChip: {
    backgroundColor: colors.primary,
  },
  timeChip: {
    backgroundColor: '#ECF1F4BF',
  },
  chipText: {
    ...typography.small,
    color: colors.dark,
  },
  cta: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingRight: 16,
  },
  ctaText: {
    ...typography.small,
    color: colors.secondary,
  },
});
