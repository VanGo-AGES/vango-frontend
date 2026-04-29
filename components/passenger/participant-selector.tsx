import { useState } from 'react';
import { StyleSheet, Text as RNText, TouchableOpacity, View } from 'react-native';
import { Icon, TextInput } from 'react-native-paper';
import { AppTextField } from '@/components/general/app-text-field';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

type ParticipantSelectorProps = {
  options: {
    id: string;
    label: string;
  }[];
  selectedId?: string;
  onSelect: (id: string | undefined) => void;
  dependentsPaddingEnd?: number;
};

export function ParticipantSelector({
  options,
  selectedId,
  onSelect,
  dependentsPaddingEnd,
}: ParticipantSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(() => !!selectedId && selectedId !== 'you');
  const [selectedGroup, setSelectedGroup] = useState<'you' | 'dependent' | undefined>(() => {
    if (!selectedId) return undefined;
    return selectedId === 'you' ? 'you' : 'dependent';
  });

  const userOption = options.find((option) => option.id === 'you');
  const dependentOptions = options.filter((option) => option.id !== 'you');

  const isUserSelected = selectedGroup === 'you';
  const isDependentGroupSelected = selectedGroup === 'dependent';

  const handleSelectUser = () => {
    setSelectedGroup('you');
    onSelect('you');
    setIsExpanded(false);
  };

  const handleSelectDependentGroup = () => {
    if (!isDependentGroupSelected) {
      setSelectedGroup('dependent');
      onSelect(undefined);
    }
    setIsExpanded((prev) => (isDependentGroupSelected ? true : !prev));
  };

  return (
    <View style={styles.container}>
      {userOption && (
        <TouchableOpacity style={styles.header} activeOpacity={0.7} onPress={handleSelectUser}>
          <View style={styles.radioWrapper}>
            <Icon
              source={isUserSelected ? 'radiobox-marked' : 'radiobox-blank'}
              size={24}
              color={isUserSelected ? colors.dark : colors.subtleText}
            />

            <RNText style={styles.optionText}>{userOption.label}</RNText>
          </View>
        </TouchableOpacity>
      )}

      {dependentOptions.length > 0 && (
        <>
          <TouchableOpacity
            style={styles.header}
            activeOpacity={0.7}
            onPress={handleSelectDependentGroup}
          >
            <View style={styles.radioWrapper}>
              <Icon
                source={isDependentGroupSelected ? 'radiobox-marked' : 'radiobox-blank'}
                size={24}
                color={isDependentGroupSelected ? colors.dark : colors.subtleText}
              />

              <RNText style={styles.optionText}>Seu dependente</RNText>
            </View>
          </TouchableOpacity>

          {isExpanded && (
            <View style={[styles.dropdownContent, { paddingEnd: dependentsPaddingEnd }]}>
              {dependentOptions.map((dependent) => {
                const isSelected = selectedId === dependent.id;

                return (
                  <TouchableOpacity
                    key={dependent.id}
                    activeOpacity={0.7}
                    onPress={() => onSelect(dependent.id)}
                  >
                    <AppTextField
                      label="Nome"
                      value={dependent.label}
                      editable={false}
                      outlineColor={colors.subtleText}
                      activeOutlineColor={colors.subtleText}
                      pointerEvents="none"
                      right={
                        <TextInput.Icon
                          icon={isSelected ? 'radiobox-marked' : 'radiobox-blank'}
                          color={isSelected ? colors.dark : colors.subtleText}
                        />
                      }
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 68,
    backgroundColor: colors.light,
    borderRadius: 4,
  },

  radioWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  optionText: {
    ...typography.body,
    color: colors.dark,
  },

  dropdownContent: {
    paddingStart: 42,
    paddingBottom: 16,
    gap: 1,
  },
});
