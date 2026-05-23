import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, withAlpha } from '@/styles/colors';
import { typography } from '@/styles/typography';

type NotificationSheetProps = {
  visible: boolean;
  onClose: () => void;
  userType: 'driver' | 'passenger';
};

type NotificationSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

const NOTIFICATION_PREFERENCES_STORAGE_KEY = '@vango:notification-preferences';

function NotificationSwitch({ value, onValueChange }: NotificationSwitchProps) {
  const translateX = useRef(new Animated.Value(value ? 24 : 0)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 24 : 0,
      duration: 160,
      useNativeDriver: true,
    }).start();
  }, [translateX, value]);

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange(!value)}
      style={[styles.switchTrack, value ? styles.switchTrackActive : styles.switchTrackInactive]}
    >
      <Animated.View
        style={[
          styles.switchThumb,
          value ? styles.switchThumbActive : styles.switchThumbInactive,
          { transform: [{ translateX }] },
        ]}
      />
    </Pressable>
  );
}

export function NotificationSheet({ visible, onClose, userType }: NotificationSheetProps) {
  const [allowSounds, setAllowSounds] = useState(false);
  const [allowUserWarnings, setAllowUserWarnings] = useState(false);
  const [allowTrafficAlerts, setAllowTrafficAlerts] = useState(false);

  const sheetTranslateY = useRef(new Animated.Value(400)).current;

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const storageKey = `${NOTIFICATION_PREFERENCES_STORAGE_KEY}:${userType}`;

  const warningTitle = userType === 'driver' ? 'Avisos dos Passageiros' : 'Avisos do Motorista';

  const warningDescription =
    userType === 'driver'
      ? 'Receba notificações dos passageiros'
      : 'Receba notificações do motorista';

  useEffect(() => {
    async function loadNotificationPreferences() {
      try {
        const storedPreferences = await AsyncStorage.getItem(storageKey);

        if (!storedPreferences) {
          return;
        }

        const preferences = JSON.parse(storedPreferences);

        setAllowSounds(Boolean(preferences.allowSounds));
        setAllowUserWarnings(Boolean(preferences.allowUserWarnings));
        setAllowTrafficAlerts(Boolean(preferences.allowTrafficAlerts));
      } catch { }
    }

    if (visible) {
      loadNotificationPreferences();
    }
  }, [visible, storageKey]);

  useEffect(() => {
    if (visible) {
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, sheetTranslateY]);

  async function saveNotificationPreferences(
    nextAllowSounds: boolean,
    nextAllowUserWarnings: boolean,
    nextAllowTrafficAlerts: boolean,
  ) {
    try {
      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify({
          allowSounds: nextAllowSounds,
          allowUserWarnings: nextAllowUserWarnings,
          allowTrafficAlerts: nextAllowTrafficAlerts,
        }),
      );
    } catch { }
  }

  function handleAllowSoundsChange(value: boolean) {
    setAllowSounds(value);
    saveNotificationPreferences(value, allowUserWarnings, allowTrafficAlerts);
  }

  function handleAllowUserWarningsChange(value: boolean) {
    setAllowUserWarnings(value);
    saveNotificationPreferences(allowSounds, value, allowTrafficAlerts);
  }

  function handleAllowTrafficAlertsChange(value: boolean) {
    setAllowTrafficAlerts(value);
    saveNotificationPreferences(allowSounds, allowUserWarnings, value);
  }

  const closeRef = useRef(() => { });
  closeRef.current = () => {
    Animated.timing(sheetTranslateY, {
      toValue: 400,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      sheetTranslateY.setValue(400);
      onCloseRef.current();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 4,

      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          sheetTranslateY.setValue(gestureState.dy);
        }
      },

      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80) {
          closeRef.current();
          return;
        }

        Animated.spring(sheetTranslateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={() => closeRef.current()}
    >
      <View style={styles.backdrop}>
        <Pressable
          style={styles.closeArea}
          onPress={() => closeRef.current()}
          accessibilityRole="button"
          accessibilityLabel="fechar notificações"
        />

        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY: sheetTranslateY }],
            },
          ]}
        >
          <View style={styles.handleTouchArea} {...panResponder.panHandlers}>
            <View style={styles.handle} />
          </View>

          <Text style={styles.title}>Notificações</Text>

          <View style={styles.optionRow}>
            <MaterialIcons name="volume-up" size={24} color={colors.sheetText} />

            <View style={styles.optionTextArea}>
              <Text style={styles.optionTitle}>Permitir sons & alertas</Text>
            </View>

            <View style={styles.switchContainer}>
              <NotificationSwitch value={allowSounds} onValueChange={handleAllowSoundsChange} />
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Tipos de Notificação</Text>

          <View style={styles.optionRow}>
            <View style={styles.optionTextArea}>
              <Text style={styles.optionTitle}>{warningTitle}</Text>
              <Text style={styles.optionDescription}>{warningDescription}</Text>
            </View>

            <View style={styles.switchContainer}>
              <NotificationSwitch
                value={allowUserWarnings}
                onValueChange={handleAllowUserWarningsChange}
              />
            </View>
          </View>

          <View style={styles.optionRow}>
            <View style={styles.optionTextArea}>
              <Text style={styles.optionTitle}>Receber alertas de trânsito</Text>
              <Text style={styles.optionDescription}>Alertas de trânsito e mudanças de rota</Text>
            </View>

            <View style={styles.switchContainer}>
              <NotificationSwitch
                value={allowTrafficAlerts}
                onValueChange={handleAllowTrafficAlertsChange}
              />
            </View>
          </View>
        </Animated.View>
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
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 16,
    paddingHorizontal: 27,
    paddingBottom: 35,
  },
  handleTouchArea: {
    alignSelf: 'stretch',
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.bottomSheetHandle,
  },
  title: {
    ...typography.bodyBold,
    color: colors.dark,
    textAlign: 'center',
    margin: 32,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  optionTextArea: {
    flex: 1,
  },
  optionTitle: {
    ...typography.bodyLarge,
    color: colors.sheetTitle,
  },
  optionDescription: {
    ...typography.bodyMedium,
    color: colors.sheetText,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.separator,
    marginVertical: 8,
  },
  sectionTitle: {
    ...typography.bodyMedium,
    color: colors.sheetText,
    marginTop: 8,
    marginBottom: 8,
  },
  switchContainer: {
    alignSelf: 'center',
  },
  switchTrack: {
    width: 52,
    height: 32,
    borderRadius: 999,
    borderWidth: 2,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  switchTrackInactive: {
    backgroundColor: colors.white,
    borderColor: colors.switchInactive,
  },
  switchTrackActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  switchThumb: {
    width: 16,
    height: 16,
    borderRadius: 999,
  },
  switchThumbInactive: {
    backgroundColor: colors.switchInactive,
  },
  switchThumbActive: {
    backgroundColor: colors.white,
  },
});
