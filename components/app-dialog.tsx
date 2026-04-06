import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

type ActionVariant = 'default' | 'destructive' | 'cancel';

export interface DialogAction {
  label: string;
  onPress: () => void;
  variant?: ActionVariant;
  icon?: string;
}

export interface AppDialogProps {
  visible: boolean;
  title: string;
  description: string;
  actions: DialogAction[];
  onRequestClose?: () => void;
}

const getActionColor = (variant: ActionVariant = 'default'): string => {
  switch (variant) {
    case 'destructive':
      return colors.destructive;
    case 'cancel':
      return colors.subtleText;
    default:
      return colors.secondary;
  }
};

const AppDialog: React.FC<AppDialogProps> = ({
  visible,
  title,
  description,
  actions,
  onRequestClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.dialogContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          <View style={styles.divider} />

          <View style={[styles.footer, actions.length === 1 && styles.footerCentered]}>
            {actions.map((action, index) => {
              const color = getActionColor(action.variant);
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.button}
                  onPress={action.onPress}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={action.label}
                >
                  {action.icon && <Icon name={action.icon as any} size={18} color={color} />}
                  <Text style={[styles.buttonText, { color }]}>{action.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AppDialog;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(14, 14, 44, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  dialogContainer: {
    backgroundColor: colors.light,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  header: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    gap: 10,
  },

  title: {
    ...typography.subtitle,
    color: colors.dark,
    fontSize: 20,
    fontWeight: '700',
  },

  description: {
    ...typography.body,
    color: colors.text,
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: colors.accent,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 24,
  },

  footerCentered: {
    justifyContent: 'center',
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
