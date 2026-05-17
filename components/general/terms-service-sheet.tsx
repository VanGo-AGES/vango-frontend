import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { TERMS_TEXT } from '@/lib/terms';

export type TermsBottomSheetProps = {
  visible: boolean;
  onClose?: () => void;
};

export function TermsBottomSheet({ visible, onClose }: TermsBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const [isMounted, setIsMounted] = useState(visible);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const BOTTOM_OVERDRAW = 0;
  const BOTTOM_MAX_HEIGHT = 520 + Math.max(24, insets.bottom);
  const BOTTOM_MIN_HEIGHT = 120;
  const MAX_TRANSLATE = BOTTOM_MAX_HEIGHT - BOTTOM_MIN_HEIGHT;

  const translateY = useSharedValue(MAX_TRANSLATE);
  const context = useSharedValue({ y: 0 });

  const springOptions = { damping: 24, stiffness: 260, overshootClamping: true };

  const closeSheet = () => {
    onClose?.();
  };

  useEffect(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (visible) {
      setIsMounted(true);
    }

    translateY.value = withSpring(visible ? 0 : MAX_TRANSLATE, springOptions);

    if (!visible) {
      closeTimeoutRef.current = setTimeout(() => {
        setIsMounted(false);
      }, 240);
    }
  }, [visible, MAX_TRANSLATE, springOptions, translateY]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

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
        translateY.value = withSpring(MAX_TRANSLATE, springOptions);
        runOnJS(closeSheet)();
      } else {
        translateY.value = withSpring(0, springOptions);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!isMounted) {
    return null;
  }

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.container,
          { height: BOTTOM_MAX_HEIGHT + BOTTOM_OVERDRAW, bottom: -BOTTOM_OVERDRAW },
          sheetStyle,
        ]}
      >
        <Pressable
          onPress={() => {
            translateY.value = withSpring(MAX_TRANSLATE, springOptions);
            closeSheet();
          }}
          hitSlop={16}
          style={styles.handleContainer}
        >
          <View style={styles.handle} />
        </Pressable>

        <Text style={styles.title}>Termos de Uso</Text>

        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: Math.max(24, insets.bottom) }]}
        >
          <Text style={styles.bodyText}>{TERMS_TEXT}</Text>
        </ScrollView>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
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
    backgroundColor: colors.subtleText,
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
