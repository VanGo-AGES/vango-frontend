import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, withAlpha } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { TripDetailsCard } from '@/components/route/trip-details-card';
import { ContactActionButton } from '@/components/route/contact-action-button';
import { SkipActionButton } from '@/components/route/driver/skip-action-button';

export type Stop = { id: string; address: string };
export type Passenger = { id: string; name: string; avatarUrl?: string; phoneNumber?: string };
export type Driver = { id: string; name: string; avatarUrl?: string; plate: string };

export type TripBottomSheetProps = {
  nextStop: Stop;
  passenger: Passenger;
  driver?: Driver;
  timeRemaining: number;
  estimatedArrival: string;
  distance: string;
  onCallPassenger?: () => void;
  onSkipStop: () => void;
  translateY?: SharedValue<number>;
  stopArrival?: {
    tripType: 'pickup' | 'dropoff';
    countdownSeconds?: number;
    onConfirmPress: () => void;
    onAbsentPress: () => void;
  };
};

export function TripBottomSheet({
  nextStop,
  passenger,
  timeRemaining,
  estimatedArrival,
  distance,
  onSkipStop,
  translateY: externalTranslateY,
  stopArrival,
}: TripBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const isArrivalSheet = Boolean(stopArrival);
  const arrivalButtonWidth = stopArrival?.tripType === 'dropoff' ? '80%' : '72%';

  const bottomPadding = Math.max(24, insets.bottom);

  const OVERDRAW = 50;
  const MAX_HEIGHT = (isArrivalSheet ? 326 : 570) + bottomPadding;
  const MIN_HEIGHT = isArrivalSheet ? 260 : 310;
  const MAX_TRANSLATE_Y = MAX_HEIGHT - MIN_HEIGHT;

  const internalTranslateY = useSharedValue(MAX_TRANSLATE_Y);
  const sheetTranslateY = externalTranslateY ?? internalTranslateY;
  const context = useSharedValue({ y: 0 });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: sheetTranslateY.value };
    })
    .onUpdate((event) => {
      const newTranslateY = context.value.y + event.translationY;
      sheetTranslateY.value = Math.max(0, Math.min(newTranslateY, MAX_TRANSLATE_Y));
    })
    .onEnd((event) => {
      if (event.velocityY > 500 || sheetTranslateY.value > MAX_TRANSLATE_Y / 2) {
        sheetTranslateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 15, stiffness: 100 });
      } else {
        sheetTranslateY.value = withSpring(0, { damping: 15, stiffness: 100 });
      }
    });

  const animatedSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: sheetTranslateY.value }],
    };
  });

  const initialSeconds = stopArrival?.countdownSeconds ?? 120;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (!stopArrival) return;
    setSecondsLeft(initialSeconds);
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [stopArrival]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.container,
          { height: MAX_HEIGHT + OVERDRAW, bottom: -OVERDRAW },
          animatedSheetStyle,
        ]}
      >
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <View style={[styles.content, { paddingBottom: bottomPadding }]}>
          {stopArrival ? (
            <View style={styles.arrivalContainer}>
              <Text style={styles.arrivalTitle}>chegou na parada!</Text>

              <Text style={styles.arrivalSubtitle}>
                {stopArrival.tripType === 'pickup'
                  ? 'tempo para o embarque:'
                  : 'tempo para o desembarque:'}
              </Text>

              <Text style={styles.arrivalTimer}>{formatTime(secondsLeft)}</Text>

              <View style={styles.arrivalDivider} />

              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.primaryButton, { width: arrivalButtonWidth }]}
                onPress={stopArrival.onConfirmPress}
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name="check"
                  size={20}
                  color={colors.white}
                  style={styles.buttonIcon}
                />
                <Text style={styles.primaryButtonText}>
                  {stopArrival.tripType === 'pickup'
                    ? 'Confirmar Embarque'
                    : 'Confirmar Desembarque'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.secondaryButton, { width: arrivalButtonWidth }]}
                onPress={stopArrival.onAbsentPress}
                accessibilityRole="button"
              >
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color={colors.destructive}
                  style={styles.buttonIcon}
                />
                <Text style={styles.secondaryButtonText}>
                  {stopArrival.tripType === 'pickup' ? 'Não embarcou' : 'Não desembarcou'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.header}>
                <Text style={styles.timeLabel}>tempo até a próxima parada:</Text>

                <View style={styles.timeHighlightContainer}>
                  <Text style={styles.timeBig}>{timeRemaining.toString().padStart(2, '0')} </Text>
                  <Text style={styles.timeUnit}>min</Text>
                </View>

                <View style={styles.statsContainer}>
                  <Text style={styles.statText}>{estimatedArrival}</Text>
                  <View style={styles.statDivider} />
                  <Text style={styles.statText}>{distance}</Text>
                </View>
              </View>

              <View style={styles.cardsContainer}>
                <TripDetailsCard
                  variant="passenger"
                  label="PASSAGEIRO:"
                  name={passenger.name}
                  avatarUrl={passenger.avatarUrl}
                />

                <View style={styles.divider} />

                <TripDetailsCard variant="address" label="ENDEREÇO:" address={nextStop.address} />
              </View>

              <View style={styles.divider} />

              <View style={styles.actionsSection}>
                <Text style={styles.actionsLabel}>AÇÕES RÁPIDAS</Text>
                <View style={styles.actionsRow}>
                  <ContactActionButton
                    variant="driver"
                    phoneNumber={passenger.phoneNumber}
                    style={styles.actionButtonMain}
                  />

                  <View style={styles.buttonDividerWrapper}>
                    <View style={styles.buttonDividerLine} />
                  </View>

                  <SkipActionButton onPress={onSkipStop} style={styles.actionButtonSkip} />
                </View>
              </View>
            </>
          )}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.light,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  handle: {
    width: 32,
    height: 4,
    backgroundColor: colors.subtleText,
    borderRadius: 100,
  },
  content: {
    flex: 1,
    paddingHorizontal: 48,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  timeLabel: {
    ...typography.body,
    color: colors.subtleText,
    marginBottom: 4,
  },
  timeHighlightContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  timeBig: {
    ...typography.header1,
    color: colors.dark,
  },
  timeUnit: {
    ...typography.header2,
    color: colors.dark,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statText: {
    ...typography.subtitle,
    color: colors.text,
  },
  statDivider: {
    height: 24,
    width: 1,
    backgroundColor: colors.accent,
    marginHorizontal: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.accent,
    marginVertical: 16,
  },
  cardsContainer: {
    gap: 16,
    marginTop: 16,
  },
  actionsSection: {
    marginTop: 0,
  },
  actionsLabel: {
    ...typography.preTitle,
    color: colors.text,
    marginBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonDividerWrapper: {
    width: 26,
    height: 32,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDividerLine: {
    width: 1,
    height: 24,
    backgroundColor: colors.accent,
  },
  actionButtonMain: {
    flex: 1,
  },
  actionButtonSkip: {
    flexShrink: 0,
  },
  arrivalContainer: {
    alignItems: 'center',
    width: '100%',
  },
  arrivalTitle: {
    ...typography.bodyBold,
    textTransform: 'none',
    marginBottom: 8,
  },
  arrivalSubtitle: {
    ...typography.body,
    color: colors.subtleText,
  },
  arrivalTimer: {
    ...typography.header1,
    marginBottom: 16,
  },
  arrivalDivider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.subtleText,
    marginBottom: 16,
  },
  primaryButton: {
    alignSelf: 'center',
    width: '72%',
    backgroundColor: colors.dark,
    paddingVertical: 10,
    borderRadius: 999,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    ...typography.bodyBold,
    color: colors.white,
    fontSize: 16,
  },
  secondaryButton: {
    alignSelf: 'center',
    width: '72%',
    backgroundColor: withAlpha(colors.destructive, 0.12),
    paddingVertical: 10,
    borderRadius: 999,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 6,
  },
  secondaryButtonText: {
    ...typography.bodyBold,
    color: colors.destructive,
    fontSize: 16,
  },
});
