import { useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { PrimaryButton } from '@/components/primary-button';
import { BottomVersionInfo } from '@/components/ui/bottom-version-info';
import { CircleIconButton } from '@/components/ui/circle-icon-button';
import { AppLogo } from '@/components/ui/app-logo';
import { SecondaryOutlinedButton } from '@/components/ui/secondary-outlined-button';
import { AppScreenContainer } from '@/components/ui/app-screen-container';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

type OnboardingPage = {
  title: string;
  titleVariant: 'header1' | 'header2';
};

const pages: OnboardingPage[] = [
  {
    title: 'A evolução na\ngestão do seu\ntransporte\nchegou',
    titleVariant: 'header2',
  },
  {
    title: 'Controle total\nde rotas e\ntranquilidade\nem tempo real',
    titleVariant: 'header2',
  },
  {
    title: 'Seu trajeto,\n   otimizado',
    titleVariant: 'header1',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const transition = useRef(new Animated.Value(1)).current;
  const isAnimatingRef = useRef(false);

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === pages.length - 1;

  const page = useMemo(() => pages[currentPage], [currentPage]);

  const translateOffset = slideDirection === 1 ? 24 : -24;

  const animatedSlideStyle = {
    opacity: transition,
    transform: [
      {
        translateX: transition.interpolate({
          inputRange: [0, 1],
          outputRange: [translateOffset, 0],
        }),
      },
    ],
  };

  const animateToPage = (nextPage: number, direction: 1 | -1) => {
    if (nextPage < 0 || nextPage >= pages.length || isAnimatingRef.current) {
      return;
    }

    isAnimatingRef.current = true;
    setSlideDirection(direction);

    Animated.timing(transition, {
      toValue: 0,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setCurrentPage(nextPage);

      Animated.timing(transition, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        isAnimatingRef.current = false;
      });
    });
  };

  const handleNext = () => {
    animateToPage(currentPage + 1, 1);
  };

  const handleBack = () => {
    animateToPage(currentPage - 1, -1);
  };

  const handleSignUp = () => {
    router.push('./register-basic-info-screen');
  };

  return (
    <AppScreenContainer backgroundColor={colors.primary} style={styles.container}>
      <AppLogo variant="light" width={64.86} height={50} style={styles.topLogo} />

      <Animated.View style={[styles.content, isLastPage && styles.contentLast, animatedSlideStyle]}>
        <View style={styles.textBlock}>
          <Text style={styles.brand}>VanGO</Text>

          <Text style={[styles[page.titleVariant], isLastPage && styles.lastTitle]}>
            {page.title}
          </Text>
        </View>

        {!isLastPage && (
          <View style={[styles.controlsRow, isFirstPage && styles.controlsRowStart]}>
            {!isFirstPage && (
              <CircleIconButton
                icon="arrow-back"
                onPress={handleBack}
                accessibilityLabel="voltar página"
              />
            )}

            <CircleIconButton
              icon="arrow-forward"
              onPress={handleNext}
              accessibilityLabel="avançar página"
            />
          </View>
        )}

        {isLastPage && (
          <View style={styles.lastFooter}>
            <View style={styles.lastControlsRow}>
              <CircleIconButton
                icon="arrow-back"
                onPress={handleBack}
                accessibilityLabel="voltar página"
              />
            </View>

            <View style={styles.lastActionsRow}>
              <PrimaryButton label="Login" onPress={() => {}} variant="primary" />

              <SecondaryOutlinedButton label="Cadastre-se" onPress={handleSignUp} />
            </View>
          </View>
        )}
      </Animated.View>

      <BottomVersionInfo theme="light" style={styles.versionInfo} brandName="VanGo" />
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  contentLast: {
    justifyContent: 'flex-start',
    paddingTop: 180,
  },
  topLogo: {
    position: 'absolute',
    top: 92,
    left: 24,
  },
  textBlock: {
    gap: 16,
  },
  brand: {
    ...typography.subtitle,
    color: colors.dark,
  },
  header1: {
    ...typography.header1,
    color: colors.dark,
    maxWidth: '100%',
  },
  header2: {
    ...typography.header2,
    color: colors.dark,
    maxWidth: 320,
  },
  lastTitle: {
    maxWidth: '100%',
    textAlign: 'center',
    alignSelf: 'center',
  },
  controlsRow: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controlsRowStart: {
    justifyContent: 'flex-end',
  },
  lastControlsRow: {
    marginTop: 56,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  lastFooter: {
    gap: 100,
  },
  lastActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  versionInfo: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 62,
  },
});
