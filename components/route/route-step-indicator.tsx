import { StyleSheet, View } from 'react-native';

import { colors } from '@/styles/colors';

type RouteStepIndicatorProps = {
  currentStep: number;
  totalSteps?: number;
};

export function RouteStepIndicator({ currentStep, totalSteps = 4 }: RouteStepIndicatorProps) {
  const safeTotalSteps = Math.max(1, totalSteps);
  const safeCurrentStep = Math.min(Math.max(1, currentStep), safeTotalSteps);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 1,
        max: safeTotalSteps,
        now: safeCurrentStep,
      }}
      style={styles.container}
    >
      {Array.from({ length: safeTotalSteps }, (_, index) => {
        const step = index + 1;

        return (
          <View
            key={step}
            style={[styles.dot, step === safeCurrentStep ? styles.dotActive : styles.dotInactive]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dot: {
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  dotActive: {
    backgroundColor: colors.dark,
  },
  dotInactive: {
    backgroundColor: colors.subtleText,
    opacity: 0.65,
  },
});
