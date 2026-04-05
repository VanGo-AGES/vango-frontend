import { StyleSheet, Text, View } from 'react-native';

import { AppTextField } from '@/components/app-text-field';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export type AddressFields = {
  cep: string;
  numero: string;
  rua: string;
  bairro: string;
  cidade: string;
};

export type AddressErrors = Partial<Record<keyof AddressFields, string>>;

type AddressFormSectionProps = {
  title: string;
  value: AddressFields;
  onChange: (field: keyof AddressFields, text: string) => void;
  errors?: AddressErrors;
};

export function AddressFormSection({
  title,
  value,
  onChange,
  errors = {},
}: AddressFormSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <AppTextField
        label="CEP"
        value={value.cep}
        onChangeText={(text) => onChange('cep', text)}
        error={errors.cep}
        keyboardType="numeric"
        placeholder="00000-000"
      />

      <AppTextField
        label="Número"
        value={value.numero}
        onChangeText={(text) => onChange('numero', text)}
        error={errors.numero}
        keyboardType="numeric"
      />

      <AppTextField
        label="Rua"
        value={value.rua}
        onChangeText={(text) => onChange('rua', text)}
        error={errors.rua}
      />

      <AppTextField
        label="Bairro"
        value={value.bairro}
        onChangeText={(text) => onChange('bairro', text)}
        error={errors.bairro}
      />

      <AppTextField
        label="Cidade"
        value={value.cidade}
        onChangeText={(text) => onChange('cidade', text)}
        error={errors.cidade}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8,
  },
  title: {
    ...typography.subtitle,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 8,
  },
});
