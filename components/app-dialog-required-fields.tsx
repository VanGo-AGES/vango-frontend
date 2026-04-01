import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export interface RequiredFieldsDialogProps {
  visible: boolean;
  onClose: () => void;
}

const AppDialogRequiredFields: React.FC<RequiredFieldsDialogProps> = ({ visible, onClose }) => {
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
            <Text style={styles.title}>Campos obrigatórios</Text>

            <Text style={styles.description}>
              Preencha todos os campos para continuar com o cadastro.
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.7}>
              <Icon name="check" size={18} color={colors.secondary} />
              <Text style={styles.buttonText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AppDialogRequiredFields;

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
    fontSize: 20,
    fontWeight: '700',
    color: colors.dark, // 👈 forte contraste
  },

  description: {
    ...typography.body,
    color: colors.subtleText,
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: colors.accent,
  },

  footer: {
    alignItems: 'center',
    paddingVertical: 20,
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
    color: colors.secondary, // iris
  },
});
