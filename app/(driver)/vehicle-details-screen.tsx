import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Controller, type FieldErrors, useForm } from 'react-hook-form';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { z } from 'zod';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppDialog from '@/components/general/app-dialog';
import { AppTextField } from '@/components/general/app-text-field';
import { PrimaryButton } from '@/components/general/primary-button';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { SectionHeader } from '@/components/route/section-header';
import { onlyDigits } from '@/lib/formatters';
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
  passengerCount: '',
  vehiclePlate: '',
  vehicleModel: '',
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

function normalizePlate(value: string) {
  return value
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase()
    .slice(0, 7);
}

export default function VehicleDetailsScreen() {
  const insets = useSafeAreaInsets();

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
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const closeDialog = () => {
    setDialog(initialDialogState);
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

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
    // TODO: integrar com serviço de veículo quando o endpoint estiver disponível no backend
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
      >
        <View style={styles.topArea}>
          <SectionHeader
            title={'Informações\ndo veículo'}
            subtitle={'Gerencie as informações\ndo seu veículo'}
            showBackButton
          />
        </View>

        <View style={styles.formCard}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            contentContainerStyle={styles.formScrollContent}
          >
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
                      onChangeText={(text) => onChange(onlyDigits(text).slice(0, 2))}
                      onSubmitEditing={() => setFocus('vehiclePlate')}
                      keyboardType="numeric"
                      maxLength={2}
                      returnKeyType="next"
                      placeholder="0"
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
                      placeholder="Placa do veículo"
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
                      placeholder="Modelo do veículo"
                      errorMessage={errors.vehicleModel?.message}
                    />
                  )}
                />
              </View>
            </View>
          </ScrollView>
        </View>

        {!isKeyboardVisible && (
          <View style={[styles.actions, { paddingBottom: insets.bottom + 32 }]}>
            {isDirty ? (
              <>
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
              </>
            ) : (
              <View style={styles.actionsPlaceholder} />
            )}
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
    minHeight: 0,
    backgroundColor: colors.light,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 62,
    paddingBottom: 24,
  },
  formScrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
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
    // paddingBottom é definido via inline style com insets.bottom + 32
    backgroundColor: colors.light,
    justifyContent: 'center',
  },
  actionsPlaceholder: {
    height: 0,
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
