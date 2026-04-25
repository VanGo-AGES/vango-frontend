import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ReactElement } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export type RouteRequestItemProps = {
  name: string;
  avatarUrl?: string;
  guardianName?: string;
  checked?: boolean;
  onCheckPress: () => void;
  onRemovePress: () => void;
};

export function RouteRequestItem({
  name,
  avatarUrl,
  guardianName,
  checked = false,
  onCheckPress,
  onRemovePress,
}: RouteRequestItemProps): ReactElement {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <MaterialIcons name="person" size={26} color={colors.light} />
          </View>
        )}

        <View style={styles.textContent}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>

          {!!guardianName && (
            <Text style={styles.guardian} numberOfLines={1}>
              Responsável: {guardianName}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableRipple
          onPress={onRemovePress}
          rippleColor="rgba(240, 106, 106, 0.12)"
          style={styles.removeButton}
        >
          <Text style={styles.removeText}>Remover</Text>
        </TouchableRipple>

        <TouchableRipple
          onPress={onCheckPress}
          rippleColor="rgba(124, 131, 253, 0.16)"
          style={[styles.checkbox, checked && styles.checkboxChecked]}
        >
          <View style={styles.checkboxContent}>
            {checked && <MaterialIcons name="check" size={16} color={colors.light} />}
          </View>
        </TouchableRipple>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    backgroundColor: colors.light,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.light,
  },

  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F4E389',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textContent: {
    flex: 1,
    justifyContent: 'center',
  },

  name: {
    ...typography.bodyBold,
    color: colors.dark,
    fontSize: 16,
    lineHeight: 16,
  },

  guardian: {
    ...typography.body,
    color: colors.text,
    fontSize: 8,
    lineHeight: 14,
    marginTop: 0,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginLeft: 16,
  },

  removeButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },

  removeText: {
    ...typography.bodyBold,
    color: '#F06A6A',
    fontSize: 10,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#9EA0BE',
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxChecked: {
    backgroundColor: '#7C83FD',
    borderColor: '#7C83FD',
  },

  checkboxContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
