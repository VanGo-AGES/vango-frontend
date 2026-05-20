import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import { MaterialIcons } from '@expo/vector-icons';

import { AppScreenContainer } from '@/components/general/app-screen-container';
import { SectionHeader } from '@/components/route/section-header';
import { NotificationSheet } from '@/components/profile/notification-sheet';
import { TermsBottomSheet } from '@/components/general/terms-service-sheet';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

type UserRole = 'driver' | 'passenger';

type SettingsOptionProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
  selectable?: boolean;
};

function SettingsOption({
  icon,
  title,
  subtitle,
  onPress,
  selectable = true,
}: SettingsOptionProps) {
  return (
    <TouchableOpacity
      style={styles.option}
      activeOpacity={selectable ? 0.6 : 1}
      onPress={onPress}
      disabled={!selectable}
      accessibilityRole={selectable ? 'button' : 'text'}
    >
      <View style={styles.optionIcon}>
        <MaterialIcons name={icon} size={24} color={colors.sheetText} />
      </View>

      <View style={styles.optionTextContainer}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSubtitle}>{subtitle}</Text>
      </View>

      {selectable && <MaterialIcons name="arrow-forward" size={24} color={colors.sheetText} />}
    </TouchableOpacity>
  );
}

export default function UserSettingsScreen() {
  const [isNotificationSheetOpen, setIsNotificationSheetOpen] = useState(false);
  const [isTermsSheetOpen, setIsTermsSheetOpen] = useState(false);

  // TODO: integrar com o usuário logado para obter role real ('driver' | 'passenger')
  const userRole: UserRole = 'driver';

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  const termsSubtitle =
    userRole === 'driver' ? 'Termos de uso para o motorista' : 'Termos de uso para o passageiro';

  return (
    <View style={styles.screen}>
      <AppScreenContainer
        backgroundColor={colors.accent}
        edges={['top', 'left', 'right']}
        style={styles.headerContainer}
      >
        <SectionHeader
          title="Configurações"
          subtitle="Gerencie suas preferências e configurações do app."
          showBackButton
        />
      </AppScreenContainer>

      <View style={styles.bottomSheet}>
        <SettingsOption
          icon="alarm"
          title="Notificações"
          subtitle="Gerencia as notificações do app"
          onPress={() => setIsNotificationSheetOpen(true)}
        />

        <View style={styles.divider} />

        <SettingsOption
          icon="front-hand"
          title="Termos de Uso"
          subtitle={termsSubtitle}
          onPress={() => setIsTermsSheetOpen(true)}
        />

        <View style={styles.divider} />

        <SettingsOption
          icon="stars"
          title="Versão do App"
          subtitle={`V${appVersion}`}
          selectable={false}
        />
      </View>

      <NotificationSheet
        visible={isNotificationSheetOpen}
        onClose={() => setIsNotificationSheetOpen(false)}
        userType={userRole}
      />

      <TermsBottomSheet visible={isTermsSheetOpen} onClose={() => setIsTermsSheetOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.accent,
  },
  headerContainer: {
    flex: 0,
    paddingBottom: 0,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: colors.light,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 77,
    gap: 10,
    marginTop: 94,
  },
  option: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  optionIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    ...typography.bodyLarge,
    color: colors.sheetTitle,
  },
  optionSubtitle: {
    ...typography.bodyMedium,
    color: colors.sheetText,
  },
  divider: {
    height: 1,
    backgroundColor: colors.separator,
    marginHorizontal: 16,
  },
});
