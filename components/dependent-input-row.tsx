import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text as RNText } from 'react-native';
import { TextInput, Icon } from 'react-native-paper';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { AppTextField } from '@/components/app-text-field';

export interface Dependent {
  id: string;
  name: string;
}

interface DependentInputRowProps {
  dependents: Dependent[];
  onChangeDependents: (dependents: Dependent[]) => void;
  hasDependents: boolean;
  onChangeHasDependents: (has: boolean) => void;
  maxDependents?: number; // Limite opcional, sem default
  errors?: any;
}

export function DependentInputRow({
  dependents = [],
  onChangeDependents,
  hasDependents,
  onChangeHasDependents,
  maxDependents,
  errors,
}: DependentInputRowProps) {
  const [isExpanded, setIsExpanded] = useState(hasDependents);

  useEffect(() => {
    if (hasDependents) setIsExpanded(true);
  }, [hasDependents]);

  const handleToggleSim = () => {
    if (hasDependents) {
      setIsExpanded(!isExpanded);
    } else {
      onChangeHasDependents(true);
      setIsExpanded(true);
    }
  };

  const handleToggleNao = () => {
    onChangeHasDependents(false);
    setIsExpanded(false);
    // Aqui acontece a limpeza: reseta a lista de dependentes para um campo vazio
    onChangeDependents([{ id: Math.random().toString(), name: '' }]);
  };

  const handleAdd = () => {
    if (maxDependents === undefined || dependents.length < maxDependents) {
      onChangeDependents([...dependents, { id: Math.random().toString(), name: '' }]);
    }
  };

  const handleRemove = (id: string) => {
    if (dependents.length === 1) {
      onChangeDependents([{ id, name: '' }]);
    } else {
      onChangeDependents(dependents.filter((d) => d.id !== id));
    }
  };

  const handleChangeName = (id: string, newName: string) => {
    onChangeDependents(dependents.map((d) => (d.id === id ? { ...d, name: newName } : d)));
  };

  const showAlertIcon =
    hasDependents && dependents.some((_, index) => !!errors?.[index]?.name?.message);

  const showAddButton = maxDependents === undefined || dependents.length < maxDependents;

  return (
    <View style={styles.container}>
      {/* Opção SIM */}
      <View style={styles.cardWrapper}>
        <TouchableOpacity style={styles.header} activeOpacity={0.7} onPress={handleToggleSim}>
          <View style={styles.radioWrapper}>
            <Icon
              source={hasDependents ? 'radiobox-marked' : 'radiobox-blank'}
              size={24}
              color={colors.dark}
            />
            <RNText style={styles.optionText}>Sim</RNText>
            {showAlertIcon && <Icon source="alert-circle" size={20} color={colors.destructive} />}
          </View>
          <View style={styles.iconWrapper}>
            <Icon
              source={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.dark}
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.dropdownContent}>
            {dependents.map((dep, index) => (
              <View key={dep.id} style={styles.inputRow}>
                <AppTextField
                  label="Nome"
                  placeholder="Nome Sobrenome"
                  value={dep.name}
                  onChangeText={(txt) => handleChangeName(dep.id, txt)}
                  error={errors?.[index]?.name?.message}
                  outlineColor={colors.subtleText}
                  activeOutlineColor={colors.subtleText}
                  style={styles.inputField}
                  right={
                    <TextInput.Icon
                      icon="close-circle-outline"
                      color={colors.subtleText}
                      onPress={() => handleRemove(dep.id)}
                    />
                  }
                />
              </View>
            ))}

            {showAddButton && (
              <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                <Icon source="plus" size={20} color={colors.subtleText} />
                <RNText style={styles.addButtonText}>Adicionar</RNText>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Opção NÃO */}
      <View style={styles.cardWrapper}>
        <TouchableOpacity style={styles.header} activeOpacity={0.7} onPress={handleToggleNao}>
          <View style={styles.radioWrapper}>
            <Icon
              source={!hasDependents ? 'radiobox-marked' : 'radiobox-blank'}
              size={24}
              color={colors.dark}
            />
            <RNText style={styles.optionText}>Não</RNText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  cardWrapper: {
    backgroundColor: colors.light,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.light,
  },
  radioWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 16,
    padding: 4,
  },
  optionText: {
    ...typography.bodyBold,
    color: colors.dark,
  },
  dropdownContent: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  inputRow: {
    width: '100%',
  },
  inputField: {
    backgroundColor: colors.accent,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.subtleText,
    borderRadius: 8,
    gap: 8,
    marginTop: 8,
    backgroundColor: 'transparent',
  },
  addButtonText: {
    ...typography.buttonText,
    color: colors.subtleText,
  },
});
