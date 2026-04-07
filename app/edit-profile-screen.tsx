import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TextInput } from 'react-native-paper';

import { AppTextField } from '@/components/app-text-field';
import { CircleIconButton } from '@/components/ui/circle-icon-button';
import { EditableProfilePicture } from '@/components/ui/editable-profile_picture';
import { PrimaryButton } from '@/components/primary-button';
import { AppScreenContainer } from '@/components/ui/app-screen-container';
import { editProfileSchema, type EditProfileFormData } from '@/schemas/edit-profile.schema';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

const defaultValues: EditProfileFormData = {
  name: 'João Silva',
  cpf: '60039877078',
  phone: '11999999999',
  password: '123456',
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function formatCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  return digits
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');
}

function formatPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) {
    return `${digits.slice(0, 2)} ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `${digits.slice(0, 2)} ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function EditProfileScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = (data: EditProfileFormData) => {
    reset(data);
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <AppScreenContainer backgroundColor={colors.accent} style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topArea}>
            <CircleIconButton
              icon="arrow-back"
              onPress={() => router.back()}
              style={styles.backCircleButton}
              accessibilityLabel="voltar"
            />

            <View style={styles.avatarWrap}>
              <EditableProfilePicture size={100} accessibilityLabel="Foto de perfil" />
            </View>
          </View>

          <View style={styles.formCard}>
            <View style={styles.formContent}>
              <Text style={styles.title}>Informações pessoais</Text>

              <View style={styles.fields}>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextField
                      label="Nome"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      errorMessage={errors.name?.message}
                      autoCapitalize="words"
                      returnKeyType="next"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="cpf"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextField
                      label="CPF"
                      value={formatCpf(value)}
                      onBlur={onBlur}
                      onChangeText={(text) => onChange(formatCpf(text))}
                      errorMessage={errors.cpf?.message}
                      keyboardType="numeric"
                      maxLength={14}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextField
                      label="Telefone"
                      value={formatPhone(value)}
                      onBlur={onBlur}
                      onChangeText={(text) => onChange(formatPhone(text))}
                      errorMessage={errors.phone?.message}
                      keyboardType="numeric"
                      maxLength={13}
                      left={<TextInput.Affix text="+55" textStyle={styles.phoneAffix} />}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppTextField
                      label="Senha"
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      errorMessage={errors.password?.message}
                      secureTextEntry
                      autoComplete="password"
                    />
                  )}
                />
              </View>

              {isDirty && (
                <View style={styles.actions}>
                  <PrimaryButton
                    label="Salvar mudanças"
                    onPress={handleSubmit(onSubmit)}
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
                    style={({ pressed }) => [pressed && styles.cancelPressed]}
                  >
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
  },
  topArea: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  backCircleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(250, 252, 254, 0.65)',
    borderWidth: 0,
  },
  avatarWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    width: 130,
    height: 130,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: colors.subtleText,
    backgroundColor: colors.accent,
    alignSelf: 'center',
    zIndex: 10,
  },
  formCard: {
    flex: 1,
    backgroundColor: colors.light,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -70,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 32,
  },
  formContent: {
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
  },
  title: {
    ...typography.bodyBold,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 28,
  },
  fields: {
    gap: 16,
  },
  phoneAffix: {
    ...typography.body,
    color: colors.dark,
  },
  actions: {
    alignItems: 'center',
    gap: 12,
    marginTop: 48,
  },
  saveButton: {
    alignSelf: 'center',
    height: 50,
  },
  cancelText: {
    ...typography.bodyBold,
    color: colors.dark,
  },
  cancelPressed: {
    opacity: 0.6,
  },
});
