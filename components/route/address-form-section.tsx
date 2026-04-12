import { useState } from 'react';
import { Keyboard, StyleSheet, Text, View } from 'react-native';

import { AppTextField } from '@/components/general/app-text-field';
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
  const [cepError, setCepError] = useState<string | undefined>();
  const [addressFilled, setAddressFilled] = useState(false);

  async function handleCepChange(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    onChange('cep', digits);

    if (addressFilled) {
      setAddressFilled(false);
      onChange('rua', '');
      onChange('bairro', '');
      onChange('cidade', '');
    }

    setCepError(undefined);

    if (digits.length === 8) {
      Keyboard.dismiss();

      try {
        const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const data = await response.json();

        if (data.erro) {
          setCepError('CEP não encontrado');
          return;
        }

        onChange('rua', data.logradouro || '');
        onChange('bairro', data.bairro || '');
        onChange('cidade', data.localidade || '');
        setAddressFilled(true);
      } catch {
        setCepError('Erro ao buscar CEP');
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <AppTextField
        label="CEP"
        value={value.cep.length > 5 ? `${value.cep.slice(0, 5)}-${value.cep.slice(5)}` : value.cep}
        onChangeText={handleCepChange}
        errorMessage={cepError ?? errors.cep}
        keyboardType="numeric"
        placeholder="CEP"
        maxLength={9}
      />

      <AppTextField
        label="Número"
        value={value.numero}
        onChangeText={(text) => onChange('numero', text.replace(/\D/g, ''))}
        errorMessage={errors.numero}
        keyboardType="numeric"
        placeholder="Número"
      />

      <AppTextField
        label="Rua"
        value={value.rua}
        editable={false}
        errorMessage={errors.rua}
        placeholder="Rua"
      />

      <AppTextField
        label="Bairro"
        value={value.bairro}
        editable={false}
        errorMessage={errors.bairro}
        placeholder="Bairro"
      />

      <AppTextField
        label="Cidade"
        value={value.cidade}
        editable={false}
        errorMessage={errors.cidade}
        placeholder="Cidade"
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
    ...typography.bodyBold,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 8,
  },
});
