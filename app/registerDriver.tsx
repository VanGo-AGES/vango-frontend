import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AppDialog from '@/components/app-dialog';
import { AppTextField } from '@/components/app-text-field';
import { PrimaryButton } from '@/components/primary-button';
import { AppScreenContainer } from '@/components/ui/app-screen-container';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export type FieldName = 'cpf' | 'passengerCount' | 'plate' | 'vehicleModel';

const MAX_PASSENGERS = 20;

const onlyDigits = (value: string) => value.replace(/\D/g, '');

const formatCpf = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const normalizePlate = (value: string) => value.toUpperCase().replace(/\s/g, '');

const isValidBrazilianPlate = (value: string) => {
  const plate = normalizePlate(value).replace(/-/g, '');
  const oldPattern = /^[A-Z]{3}[0-9]{4}$/;
  const mercosulPattern = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;

  return oldPattern.test(plate) || mercosulPattern.test(plate);
};

export default function RegisterDriverScreen() {
  const router = useRouter();

  const [cpf, setCpf] = useState('');
  const [passengerCount, setPassengerCount] = useState('');
  const [plate, setPlate] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [showRequiredFieldsDialog, setShowRequiredFieldsDialog] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});

  const validateField = (field: FieldName, value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return 'Este campo é obrigatório.';
    }

    if (field === 'cpf' && onlyDigits(trimmedValue).length !== 11) {
      return 'CPF inválido';
    }

    if (field === 'passengerCount') {
      const parsed = Number(trimmedValue);

      if (!Number.isInteger(parsed) || parsed <= 0) {
        return 'Informe um número válido';
      }

      if (parsed > MAX_PASSENGERS) {
        return `O número máximo permitido é ${MAX_PASSENGERS}`;
      }
    }

    if (field === 'plate' && !isValidBrazilianPlate(trimmedValue)) {
      return 'Placa de veículo inválida';
    }

    return '';
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<FieldName, string>> = {
      cpf: validateField('cpf', cpf),
      passengerCount: validateField('passengerCount', passengerCount),
      plate: validateField('plate', plate),
      vehicleModel: validateField('vehicleModel', vehicleModel),
    };

    const onlyErrors = Object.fromEntries(
      Object.entries(nextErrors).filter(([, message]) => !!message),
    ) as Partial<Record<FieldName, string>>;

    setFieldErrors(onlyErrors);

    return Object.keys(onlyErrors).length === 0;
  };

  const handleContinue = () => {
    const isFormValid = validateForm();

    if (!isFormValid) {
      const hasRequiredFieldError = [cpf, passengerCount, plate, vehicleModel].some(
        (value) => !value.trim(),
      );

      if (hasRequiredFieldError) {
        setShowRequiredFieldsDialog(true);
      }

      return;
    }

    // TODO: integrar com o próximo passo do fluxo de cadastro
  };

  return (
    <AppScreenContainer backgroundColor={colors.primary} style={styles.screenContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <View style={styles.headerArea}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="voltar"
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          >
            <MaterialIcons name="arrow-back" size={22} color={colors.dark} />
          </Pressable>

          <Text style={styles.title}>Cadastro</Text>
          <Text style={styles.subtitle}>Comece sua jornada{`\n`}na VanGO</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informações adicionais</Text>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.fieldsContainer}>
              <AppTextField
                label="CPF"
                value={cpf}
                onChangeText={(value) => setCpf(formatCpf(value))}
                onBlur={() =>
                  setFieldErrors((current) => ({ ...current, cpf: validateField('cpf', cpf) }))
                }
                keyboardType="number-pad"
                placeholder="999.999.999-99"
                maxLength={14}
                error={fieldErrors.cpf}
              />

              <AppTextField
                label="Número de passageiros"
                value={passengerCount}
                onChangeText={(value) => setPassengerCount(onlyDigits(value).slice(0, 2))}
                onBlur={() =>
                  setFieldErrors((current) => ({
                    ...current,
                    passengerCount: validateField('passengerCount', passengerCount),
                  }))
                }
                keyboardType="number-pad"
                placeholder="Número de passageiros"
                maxLength={2}
                error={fieldErrors.passengerCount}
              />

              <AppTextField
                label="Placa do veículo"
                value={plate}
                onChangeText={(value) => setPlate(normalizePlate(value))}
                onBlur={() =>
                  setFieldErrors((current) => ({
                    ...current,
                    plate: validateField('plate', plate),
                  }))
                }
                autoCapitalize="characters"
                placeholder="Placa do veículo"
                maxLength={8}
                error={fieldErrors.plate}
              />

              <AppTextField
                label="Modelo do veículo"
                value={vehicleModel}
                onChangeText={setVehicleModel}
                onBlur={() =>
                  setFieldErrors((current) => ({
                    ...current,
                    vehicleModel: validateField('vehicleModel', vehicleModel),
                  }))
                }
                placeholder="Modelo do veículo"
                error={fieldErrors.vehicleModel}
              />
            </View>

            <View style={styles.footer}>
              <PrimaryButton
                label="Finalizar"
                onPress={handleContinue}
                labelColor={colors.light}
                icon={<MaterialIcons name="arrow-forward" size={18} color={colors.light} />}
                style={styles.nextButton}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      <AppDialog
        visible={showRequiredFieldsDialog}
        title="Campos obrigatórios"
        description="Preencha todos os campos para continuar com o cadastro."
        onRequestClose={() => setShowRequiredFieldsDialog(false)}
        actions={[
          {
            label: 'Ok',
            icon: 'check',
            onPress: () => setShowRequiredFieldsDialog(false),
          },
        ]}
      />
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    padding: 0,
  },
  keyboardContainer: {
    flex: 1,
  },
  headerArea: {
    paddingTop: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
  },
  backButtonPressed: {
    opacity: 0.65,
  },
  title: {
    ...typography.header3,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    ...typography.bodyBold,
    color: colors.dark,
    textAlign: 'center',
  },
  card: {
    marginTop: 28,
    flex: 1,
    backgroundColor: colors.light,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 14,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 12,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  fieldsContainer: {
    gap: 6,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 6,
  },
  nextButton: {
    alignSelf: 'center',
  },
});
