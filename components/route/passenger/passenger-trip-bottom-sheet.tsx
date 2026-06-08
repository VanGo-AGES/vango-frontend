import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { TripDetailsCard } from '@/components/route/trip-details-card';

export type PassengerTripSheetState = 'driver_on_the_way' | 'driver_arrived' | 'on_board';

export type PassengerTripBottomSheetProps = {
  state: PassengerTripSheetState;
  driver: {
    id: string;
    name: string;
    avatarUrl?: string;
    plate: string;
  };
  timeRemaining: number | null;
  estimatedArrival: string;
  distance: string;
  countdownSeconds?: number;
  address?: string;
  onCallPress?: () => void;
};

function CountdownTimer({ initialSeconds }: { initialSeconds: number }) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return (
    <Text style={styles.timeBig}>
      {mm}:{ss}
    </Text>
  );
}

export function PassengerTripBottomSheet({
  state,
  driver,
  timeRemaining,
  estimatedArrival,
  distance,
  countdownSeconds = 120,
  address,
  onCallPress,
}: PassengerTripBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(24, insets.bottom);

  const OVERDRAW = 50;
  const MAX_HEIGHT = 570 + bottomPadding;
  const MIN_HEIGHT = 310;
  const MAX_TRANSLATE_Y = MAX_HEIGHT - MIN_HEIGHT;

  const translateY = useSharedValue(MAX_TRANSLATE_Y);
  const context = useSharedValue({ y: 0 });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      const newTranslateY = context.value.y + event.translationY;
      translateY.value = Math.max(0, Math.min(newTranslateY, MAX_TRANSLATE_Y));
    })
    .onEnd((event) => {
      if (event.velocityY > 500 || translateY.value > MAX_TRANSLATE_Y / 2) {
        translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 15, stiffness: 100 });
      } else {
        translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
      }
    });

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

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
          {state === 'driver_on_the_way' && (
            <>
              <View style={styles.header}>
                <Text style={styles.timeLabel}>seu motorista vai chegar em:</Text>
                {timeRemaining != null ? (
                  <View style={styles.timeHighlightContainer}>
                    <Text style={styles.timeBig}>{String(timeRemaining).padStart(2, '0')} </Text>
                    <Text style={styles.timeUnit}>min</Text>
                  </View>
                ) : (
                  <Text style={styles.calculating}>Calculando...</Text>
                )}
                <View style={styles.statsContainer}>
                  <Text style={styles.statText}>{estimatedArrival}</Text>
                  <View style={styles.statDivider} />
                  <Text style={styles.statText}>{distance}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <TripDetailsCard
                variant="driver"
                label="INFORMAÇÕES DO MOTORISTA:"
                name={driver.name}
                avatarUrl={driver.avatarUrl}
                plate={driver.plate}
              />

              <View style={styles.sectionSpacer} />

              <TripDetailsCard
                variant="address"
                label="ENDEREÇO DE ENTREGA"
                address={address ?? 'Endereço não disponível'}
              />

              <View style={styles.sectionSpacer} />

              <View style={styles.quickActionsContainer}>
                <Text style={styles.quickActionsTitle}>AÇÕES RÁPIDAS</Text>

                <Pressable
                  onPress={onCallPress}
                  style={({ pressed }) => [styles.callButton, pressed && styles.callButtonPressed]}
                >
                  <MaterialCommunityIcons name="phone-outline" size={18} color={colors.dark} />
                  <Text style={styles.callButtonText}>Chamar Motorista</Text>
                </Pressable>
              </View>
            </>
          )}

          {state === 'driver_arrived' && (
            <>
              <View style={styles.header}>
                <Text style={styles.arrivedTitle}>seu motorista chegou!</Text>
                <Text style={styles.timeLabel}>tempo para o embarque:</Text>
                <CountdownTimer initialSeconds={countdownSeconds} />
              </View>

              <View style={styles.divider} />

              <TripDetailsCard
                variant="driver"
                label="INFORMAÇÕES DO MOTORISTA:"
                name={driver.name}
                avatarUrl={driver.avatarUrl}
                plate={driver.plate}
              />
            </>
          )}

          {state === 'on_board' && (
            <>
              <View style={styles.header}>
                <Text style={styles.timeLabel}>tempo estimado para chegada:</Text>
                {timeRemaining != null ? (
                  <View style={styles.timeHighlightContainer}>
                    <Text style={styles.timeBig}>{String(timeRemaining).padStart(2, '0')} </Text>
                    <Text style={styles.timeUnit}>min</Text>
                  </View>
                ) : (
                  <Text style={styles.calculating}>Calculando...</Text>
                )}
                <View style={styles.statsContainer}>
                  <Text style={styles.statText}>{estimatedArrival}</Text>
                  <View style={styles.statDivider} />
                  <Text style={styles.statText}>{distance}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <TripDetailsCard
                variant="driver"
                label="INFORMAÇÕES DO MOTORISTA:"
                name={driver.name}
                avatarUrl={driver.avatarUrl}
                plate={driver.plate}
              />
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
  arrivedTitle: {
    ...typography.header3,
    color: colors.dark,
    marginBottom: 4,
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
  calculating: {
    ...typography.header3,
    color: colors.dark,
    marginVertical: 8,
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
  sectionSpacer: {
    height: 16,
  },
  quickActionsContainer: {
    gap: 12,
  },
  quickActionsTitle: {
    ...typography.preTitle,
    color: colors.text,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  callButtonPressed: {
    opacity: 0.85,
  },
  callButtonText: {
    ...typography.bodyBold,
    color: colors.dark,
  },
});
