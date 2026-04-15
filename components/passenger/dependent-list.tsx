import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import { AppTextField } from '@/components/general/app-text-field';
import { SubtleOutlinedButton } from '@/components/general/subtle-outlined-button';
import { colors } from '@/styles/colors';
import type { Dependent } from '@/types/dependents.types';

interface DependentListProps {
  dependents: Dependent[];
  onChangeName: (id: string, name: string) => void;
  onRemoveRequest: (id: string) => void;
  onAdd: () => void;
  showAddButton?: boolean;
  errors?: any;
}

export function DependentList({
  dependents,
  onChangeName,
  onRemoveRequest,
  onAdd,
  showAddButton = true,
  errors,
}: DependentListProps) {
  return (
    <View style={styles.container}>
      {dependents.map((dep, index) => (
        <View key={dep.id} style={styles.inputRow}>
          <AppTextField
            label="Nome"
            placeholder="Nome Sobrenome"
            value={dep.name}
            onChangeText={(txt) => onChangeName(dep.id, txt)}
            errorMessage={errors?.[index]?.name?.message}
            outlineColor={colors.subtleText}
            activeOutlineColor={colors.subtleText}
            style={styles.textField}
            right={
              <TextInput.Icon
                icon="close-circle-outline"
                color={colors.subtleText}
                onPress={() => onRemoveRequest(dep.id)}
              />
            }
          />
        </View>
      ))}

      {showAddButton && (
        <SubtleOutlinedButton
          label="Adicionar"
          icon="plus"
          onPress={onAdd}
          style={styles.addButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    width: '100%',
  },
  inputRow: {
    width: '100%',
  },
  textField: {
    backgroundColor: 'transparent',
  },
  addButton: {
    marginTop: 8,
  },
});
