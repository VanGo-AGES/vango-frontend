import { useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/general/primary-button';
import { BottomVersionInfo } from '@/components/general/bottom-version-info';
import { CircleIconButton } from '@/components/general/circle-icon-button';
import { AppLogo } from '@/components/general/app-logo';
import { SecondaryOutlinedButton } from '@/components/general/secondary-outlined-button';
import { AppScreenContainer } from '@/components/general/app-screen-container';
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
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
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
    router.push('/register-profile-selection-screen');
  };

  return (
    <AppScreenContainer backgroundColor={colors.primary} style={styles.container}>
      <AppLogo
        variant="light"
        width={64.86}
        height={50}
        style={[styles.topLogo, { top: insets.top + 16 }]}
      />

      <Animated.View
        style={[
          styles.content,
          isLastPage && { justifyContent: 'flex-start', paddingTop: height * 0.22 },
          animatedSlideStyle,
        ]}
      >
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
              {/* TODO: substituir por /login quando o fluxo de login for implementado */}
              <PrimaryButton
                label="Login"
                onPress={() => router.push('/register-profile-selection-screen')}
                variant="primary"
              />

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
  topLogo: {
    position: 'absolute',
    left: 24,
    // top is set dynamically via inline style using insets.top + 16
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
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  lastFooter: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 80,
  },
  lastActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  versionInfo: {
    // flui normalmente no layout — sem position absolute
  },
});
