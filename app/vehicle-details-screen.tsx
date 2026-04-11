import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, type FieldErrors, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

import AppDialog from '@/components/app-dialog';
import { AppTextField } from '@/components/app-text-field';
import { PrimaryButton } from '@/components/primary-button';
import { AppScreenContainer } from '@/components/ui/app-screen-container';
import { SectionHeader } from '@/components/ui/section-header';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

enum VehicleDetailsErrorMessage {
  PASSENGERS_REQUIRED = 'Número de passageiros é obrigatório',
  PASSENGERS_INVALID = 'Informe apenas números válidos',
  PASSENGERS_LIMIT = 'Número de passageiros deve ser até 20',
  PLATE_REQUIRED = 'Placa do veículo é obrigatória',
  PLATE_INVALID = 'Placa do veículo inválida',
  MODEL_REQUIRED = 'Modelo do veículo é obrigatório',
}

const oldPlateRegex = /^[A-Z]{3}[0-9]{4}$/;
const mercosulPlateRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;

const vehicleDetailsSchema = z.object({
  passengerCount: z
    .string()
    .trim()
    .min(1, VehicleDetailsErrorMessage.PASSENGERS_REQUIRED)
    .refine((value) => /^\d{1,2}$/.test(value), {
      message: VehicleDetailsErrorMessage.PASSENGERS_INVALID,
    })
    .refine((value) => Number(value) <= 20, {
      message: VehicleDetailsErrorMessage.PASSENGERS_LIMIT,
    }),
  vehiclePlate: z
    .string()
    .trim()
    .min(1, VehicleDetailsErrorMessage.PLATE_REQUIRED)
    .refine((value) => oldPlateRegex.test(value) || mercosulPlateRegex.test(value), {
      message: VehicleDetailsErrorMessage.PLATE_INVALID,
    }),
  vehicleModel: z.string().trim().min(1, VehicleDetailsErrorMessage.MODEL_REQUIRED),
});

type VehicleDetailsFormData = z.infer<typeof vehicleDetailsSchema>;

const defaultValues: VehicleDetailsFormData = {
  passengerCount: '00',
  vehiclePlate: 'BRA2E26',
  vehicleModel: 'Mercedes-Benz Sprinter 417',
};

type DialogState = {
  visible: boolean;
  title: string;
  description: string;
};

const initialDialogState: DialogState = {
  visible: false,
  title: '',
  description: '',
};

function formatPassengerCount(value: string) {
  return value.replace(/\D/g, '').slice(0, 2);
}

function normalizePlate(value: string) {
  return value
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase()
    .slice(0, 7);
}

export default function VehicleDetailsScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<VehicleDetailsFormData>({
    resolver: zodResolver(vehicleDetailsSchema),
    defaultValues,
    mode: 'onChange',
  });

  const [dialog, setDialog] = useState<DialogState>(initialDialogState);

  const closeDialog = () => {
    setDialog(initialDialogState);
  };

  const onInvalid = (fieldErrors: FieldErrors<VehicleDetailsFormData>) => {
    if (
      fieldErrors.passengerCount?.message === VehicleDetailsErrorMessage.PASSENGERS_REQUIRED ||
      fieldErrors.vehiclePlate?.message === VehicleDetailsErrorMessage.PLATE_REQUIRED ||
      fieldErrors.vehicleModel?.message === VehicleDetailsErrorMessage.MODEL_REQUIRED
    ) {
      setDialog({
        visible: true,
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos para continuar.',
      });
      return;
    }

    if (fieldErrors.vehiclePlate?.message === VehicleDetailsErrorMessage.PLATE_INVALID) {
      setDialog({
        visible: true,
        title: 'Placa inválida',
        description: 'Digite uma placa válida para continuar.',
      });
      return;
    }

    if (fieldErrors.passengerCount?.message === VehicleDetailsErrorMessage.PASSENGERS_LIMIT) {
      setDialog({
        visible: true,
        title: 'Limite excedido',
        description: 'O número de passageiros deve ser no máximo 20.',
      });
    }
  };

  const onSubmit = (data: VehicleDetailsFormData) => {
    reset(data);
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <AppScreenContainer
      backgroundColor={colors.accent}
      edges={['top', 'left', 'right']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.topArea}>
          <SectionHeader
            title={'Informações\ndo veículo'}
            subtitle={'Gerencie as informações\ndo seu veículo'}
            showBackButton
          />
        </View>

        <View style={styles.formCard}>
          <View style={styles.formContent}>
            <Text style={styles.sectionTitle}>Informações adicionais</Text>

            <View style={styles.fields}>
              <Controller
                control={control}
                name="passengerCount"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppTextField
                    label="Número de passageiros"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(formatPassengerCount(text))}
                    onSubmitEditing={() => setFocus('vehiclePlate')}
                    keyboardType="numeric"
                    maxLength={2}
                    returnKeyType="next"
                    errorMessage={errors.passengerCount?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="vehiclePlate"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppTextField
                    label="Placa do veículo"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(text) => onChange(normalizePlate(text))}
                    onSubmitEditing={() => setFocus('vehicleModel')}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    maxLength={7}
                    returnKeyType="next"
                    errorMessage={errors.vehiclePlate?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="vehicleModel"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppTextField
                    label="Modelo do veículo"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    autoCapitalize="words"
                    returnKeyType="done"
                    errorMessage={errors.vehicleModel?.message}
                  />
                )}
              />
            </View>
          </View>
        </View>

        {isDirty && (
          <View style={styles.actions}>
            <PrimaryButton
              label="Salvar Mudanças"
              onPress={handleSubmit(onSubmit, onInvalid)}
              disabled={isSubmitting}
              icon={<MaterialIcons name="check" size={18} color={colors.light} />}
              labelColor={colors.light}
              style={styles.saveButton}
            />

            <Pressable
              onPress={handleCancel}
              accessibilityRole="button"
              accessibilityLabel="cancelar alterações"
              disabled={isSubmitting}
              style={({ pressed }) => pressed && styles.cancelPressed}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>

      <AppDialog
        visible={dialog.visible}
        onRequestClose={closeDialog}
        title={dialog.title}
        description={dialog.description}
        actions={[
          {
            label: 'Ok',
            onPress: closeDialog,
            icon: 'check',
            variant: 'default',
          },
        ]}
      />
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  topArea: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
  },
  formCard: {
    flex: 1,
    backgroundColor: colors.light,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 62,
  },
  formContent: {
    width: '100%',
    maxWidth: 290,
    alignSelf: 'center',
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 24,
  },
  fields: {
    gap: 16,
  },
  actions: {
    alignItems: 'center',
    gap: 12,
    paddingBottom: 82,
    backgroundColor: colors.light,
  },
  saveButton: {
    alignSelf: 'center',
  },
  cancelText: {
    ...typography.bodyBold,
    color: colors.dark,
  },
  cancelPressed: {
    opacity: 0.6,
  },
});
