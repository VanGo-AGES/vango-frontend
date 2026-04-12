import { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text as RNText } from 'react-native';
import { Icon } from 'react-native-paper';

import { DependentList, type Dependent } from '@/components/passenger/dependent-list';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

interface DependentInputRowProps {
  dependents: Dependent[];
  onChangeDependents: (dependents: Dependent[]) => void;
  hasDependents: boolean | null;
  onChangeHasDependents: (has: boolean) => void;
  maxDependents?: number;
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
  const [isExpanded, setIsExpanded] = useState(hasDependents === true);

  useEffect(() => {
    if (hasDependents === true) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [hasDependents]);

  const handleToggleSim = () => {
    if (hasDependents === true) {
      setIsExpanded(!isExpanded);
    } else {
      onChangeHasDependents(true);
      setIsExpanded(true);
    }
  };

  const handleToggleNao = () => {
    onChangeHasDependents(false);
    setIsExpanded(false);
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
    hasDependents === true && dependents.some((_, index) => !!errors?.[index]?.name?.message);

  const showAddButton =
    hasDependents === true && (maxDependents === undefined || dependents.length < maxDependents);

  return (
    <View style={styles.container}>
      <View style={styles.cardWrapper}>
        <TouchableOpacity style={styles.header} activeOpacity={0.7} onPress={handleToggleSim}>
          <View style={styles.radioWrapper}>
            <Icon
              source={hasDependents === true ? 'radiobox-marked' : 'radiobox-blank'}
              size={24}
              color={hasDependents === true ? colors.dark : colors.subtleText}
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
            <DependentList
              dependents={dependents}
              onChangeName={handleChangeName}
              onRemoveRequest={handleRemove}
              onAdd={handleAdd}
              showAddButton={showAddButton}
              errors={errors}
            />
          </View>
        )}
      </View>

      <View style={styles.cardWrapper}>
        <TouchableOpacity style={styles.header} activeOpacity={0.7} onPress={handleToggleNao}>
          <View style={styles.radioWrapper}>
            <Icon
              source={hasDependents === false ? 'radiobox-marked' : 'radiobox-blank'}
              size={24}
              color={hasDependents === false ? colors.dark : colors.subtleText}
            />
            <RNText style={styles.optionText}>Não</RNText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  cardWrapper: {
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
    gap: 8,
  },
  iconWrapper: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 4,
  },
  optionText: {
    ...typography.body,
    color: colors.dark,
  },
  dropdownContent: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    gap: 8,
  },
});
