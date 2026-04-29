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
  onSelect: (id: string) => void;
};

export function ParticipantSelector({ options, selectedId, onSelect }: ParticipantSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedType, setSelectedType] = useState<'you' | 'dependent' | undefined>();

  const userOption = options.find((option) => option.id === 'you');
  const dependentOptions = options.filter((option) => option.id !== 'you');

  const isUserSelected = selectedType === 'you';
  const isDependentGroupSelected = selectedType === 'dependent';

  const handleSelectUser = () => {
    if (!userOption) return;

    setSelectedType('you');
    onSelect(userOption.id);
    setIsExpanded(false);
  };

  const handleSelectDependentGroup = () => {
    setSelectedType('dependent');
    setIsExpanded(true);
  };

  const handleSelectDependent = (id: string) => {
    onSelect(id);
  };

  return (
    <View style={styles.container}>
      {userOption && (
        <View style={styles.cardWrapper}>
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
        </View>
      )}

      {dependentOptions.length > 0 && (
        <View style={styles.cardWrapper}>
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
              {dependentOptions.map((dependent) => {
                const isSelected = selectedId === dependent.id;

                return (
                  <TouchableOpacity
                    key={dependent.id}
                    activeOpacity={0.7}
                    onPress={() => handleSelectDependent(dependent.id)}
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
                          onPress={() => handleSelectDependent(dependent.id)}
                        />
                      }
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },

  cardWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.accent,
    alignSelf: 'center',
    width: 315,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

  iconWrapper: {
    backgroundColor: colors.accent,
    minWidth: 32,
    borderRadius: 16,
    padding: 6,
  },

  optionText: {
    ...typography.body,
    color: colors.dark,
  },

  dropdownContent: {
    paddingLeft: 42,
    paddingBottom: 16,
    gap: 1,
  },
});
