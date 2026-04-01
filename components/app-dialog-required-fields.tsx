import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export interface RequiredFieldsDialogProps {
  visible: boolean;
  onClose: () => void;
}

const RequiredFieldsDialog: React.FC<RequiredFieldsDialogProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.dialogContainer}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              Campos obrigatórios
            </Text>
            <Text style={styles.description} numberOfLines={3}>
              Preencha todos os campos para continuar com o cadastro.
            </Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.button}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Ok"
            >
              <Icon name="check" size={18} color={colors.primary} />
              <Text style={styles.buttonText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RequiredFieldsDialog;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 8,
  },
  title: {
    ...typography.subtitle,
    color: colors.dark,
    fontSize: 20,
    fontWeight: '700',
  },
  description: {
    ...typography.body,
    color: colors.subtleText,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
    justifyContent: 'center',
    gap: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
