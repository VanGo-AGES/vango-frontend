import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export interface DeleteDialogProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const AppDialogDeleteDependent: React.FC<DeleteDialogProps> = ({
  visible,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.dialogContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Tem certeza que quer deletar o dependente?</Text>

            <Text style={styles.description}>Essa ação não poderá ser desfeita.</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.button}
              onPress={onCancel}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Cancelar"
            >
              <Icon name="close" size={18} color={colors.subtleText} />
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={onConfirm}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Deletar"
            >
              <Icon name="check" size={18} color={colors.destructive} />
              <Text style={styles.deleteText}>Deletar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AppDialogDeleteDependent;

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

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.subtleText,
  },

  deleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.destructive,
  },
});
