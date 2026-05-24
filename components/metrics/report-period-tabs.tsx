import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export type ReportPeriodType = 'day' | 'week' | 'month';

export type ReportPeriodTabsProps = {
  selectedPeriod: ReportPeriodType;
  onChangePeriod: (period: ReportPeriodType) => void;
};

const TABS: { value: ReportPeriodType; label: string }[] = [
  { value: 'day', label: 'Dia' },
  { value: 'week', label: 'Semana' },
  { value: 'month', label: 'Mês' },
];

export function ReportPeriodTabs({ selectedPeriod, onChangePeriod }: ReportPeriodTabsProps) {
  return (
    <View style={styles.container}>
      {/* Divider inferior de 1px ocupando 100% da largura */}
      <View style={styles.divider} />

      {TABS.map((tab) => {
        const isActive = selectedPeriod === tab.value;
        return (
          <Pressable key={tab.value} style={styles.tab} onPress={() => onChangePeriod(tab.value)}>
            <View style={styles.stateLayer}>
              <View style={styles.contentWrapper}>
                <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
                  {tab.label}
                </Text>

                {isActive && <View style={styles.activeIndicator} />}
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 48,
    backgroundColor: colors.accent,
    position: 'relative',
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.separator,
  },
  tab: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  stateLayer: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  contentWrapper: {
    alignItems: 'center',
    paddingBottom: 16,
    position: 'relative',
  },
  label: {
    ...typography.body,
  },
  labelActive: {
    color: colors.dark,
    ...typography.bodyBold,
  },
  labelInactive: {
    color: colors.subtleText,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.dark,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    zIndex: 1,
  },
});
