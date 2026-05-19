import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, withAlpha } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { TERMS_TEXT } from '@/lib/terms';

const SPRING_OPTIONS = {
  damping: 24,
  stiffness: 260,
  overshootClamping: true,
} as const;

export type TermsBottomSheetProps = {
  visible: boolean;
  onClose?: () => void;
};

export function TermsBottomSheet({ visible, onClose }: TermsBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const [isMounted, setIsMounted] = useState(visible);
  const isClosingRef = useRef(false);

  const BOTTOM_OVERDRAW = 0;
  const BOTTOM_MAX_HEIGHT = 520 + Math.max(24, insets.bottom);
  const BOTTOM_MIN_HEIGHT = 120;
  const MAX_TRANSLATE = BOTTOM_MAX_HEIGHT - BOTTOM_MIN_HEIGHT;
  const CLOSE_TRANSLATE = BOTTOM_MAX_HEIGHT;

  const translateY = useSharedValue(MAX_TRANSLATE);
  const context = useSharedValue({ y: 0 });

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      isClosingRef.current = false;
      translateY.value = withSpring(0, SPRING_OPTIONS);
      return;
    }

    if (isMounted && !isClosingRef.current) {
      animateClose();
    }
  }, [visible, isMounted, translateY]);

  function handleCloseComplete() {
    setIsMounted(false);
    isClosingRef.current = false;
    onClose?.();
  }

  function animateClose() {
    if (isClosingRef.current) {
      return;
    }

    isClosingRef.current = true;
    translateY.value = withSpring(CLOSE_TRANSLATE, SPRING_OPTIONS, (finished) => {
      'worklet';

      if (finished) {
        runOnJS(handleCloseComplete)();
      }
    });
  }

  const pan = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((e) => {
      'worklet';
      const newY = context.value.y + e.translationY;
      translateY.value = Math.max(0, Math.min(newY, MAX_TRANSLATE));
    })
    .onEnd((e) => {
      'worklet';
      if (e.velocityY > 800 || translateY.value > MAX_TRANSLATE * 0.65) {
        runOnJS(animateClose)();
      } else {
        translateY.value = withSpring(0, SPRING_OPTIONS);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      visible={isMounted}
      transparent
      animationType="none"
      onRequestClose={animateClose}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <Pressable
          style={styles.closeArea}
          onPress={animateClose}
          accessibilityRole="button"
          accessibilityLabel="fechar termos de uso"
        />

        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.container,
              { height: BOTTOM_MAX_HEIGHT + BOTTOM_OVERDRAW, bottom: -BOTTOM_OVERDRAW },
              sheetStyle,
            ]}
          >
            <Pressable onPress={animateClose} hitSlop={16} style={styles.handleContainer}>
              <View style={styles.handle} />
            </Pressable>

            <Text style={styles.title}>Termos de Uso</Text>

            <ScrollView
              contentContainerStyle={[
                styles.content,
                { paddingBottom: Math.max(24, insets.bottom) },
              ]}
            >
              <Text style={styles.bodyText}>{TERMS_TEXT}</Text>
            </ScrollView>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: withAlpha(colors.dark, 0.35),
  },
  closeArea: {
    flex: 1,
  },
  container: {
    backgroundColor: colors.light,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
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
    backgroundColor: colors.bottomSheetHandle,
    borderRadius: 100,
  },
  title: {
    ...typography.bodyBold,
    textAlign: 'center',
    color: colors.dark,
    marginBottom: 32,
    marginTop: 32,
  },
  content: {
    paddingHorizontal: 32,
  },
  bodyText: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
});
