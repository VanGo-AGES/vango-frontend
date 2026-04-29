import {
  Alert,
  Linking,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Href, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

const VARIANT_LABELS = {
  driver: 'Chamar Passageiro',
  passenger: 'Chamar Motorista',
} as const;

export type ContactActionButtonProps = {
  variant: 'driver' | 'passenger';
  phoneNumber: string;
  onPress?: () => void;
  href?: Href;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function ContactActionButton({
  variant,
  phoneNumber,
  onPress,
  href,
  disabled = false,
  style,
}: ContactActionButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (href) {
      router.push(href);
    }
    if (onPress) {
      onPress();
    }

    if (!href && phoneNumber) {
      Alert.alert(
        VARIANT_LABELS[variant],
        'Como você prefere entrar em contato?',
        [
          {
            text: 'Ligar',
            onPress: () => Linking.openURL(`tel:${phoneNumber}`),
          },
          {
            text: 'WhatsApp',
            onPress: () => {
              const cleanNumber = phoneNumber.replace(/\D/g, '');
              Linking.openURL(`whatsapp://send?phone=${cleanNumber}`);
            },
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ],
        { cancelable: true },
      );
    }
  };

  const isDisabled = disabled || !phoneNumber;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      style={[styles.button, isDisabled && styles.buttonDisabled, style]}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons
          name="phone-hangup"
          size={20}
          color={isDisabled ? colors.subtleText : colors.dark}
        />
        <Text style={[styles.label, isDisabled && styles.labelDisabled]}>
          {VARIANT_LABELS[variant]}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    gap: 8,
  },
  label: {
    ...typography.small,
    color: colors.dark,
    letterSpacing: 0.1,
  },
  labelDisabled: {
    color: colors.subtleText,
  },
});
