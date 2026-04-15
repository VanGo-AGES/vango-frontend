import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TextInput } from 'react-native-paper';

import { AppTextField } from '@/components/general/app-text-field';
import { CircleIconButton } from '@/components/general/circle-icon-button';
import { EditableProfilePicture } from '@/components/profile/editable-profile-picture';
import { PrimaryButton } from '@/components/general/primary-button';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { editProfileSchema, type EditProfileFormData } from '@/schemas/edit-profile.schema';
import { getUser, updateUser, uploadPhoto } from '@/services/user.service';
import { ApiError } from '@/services/api';
import { useSessionStore } from '@/store/session.store';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

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
  const sessionUser = useSessionStore((s) => s.user);
  const updateSessionUser = useSessionStore((s) => s.updateUser);
  const localPhotoUri = useSessionStore((s) => s.localPhotoUri);
  const setLocalPhotoUri = useSessionStore((s) => s.setLocalPhotoUri);

  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [pendingPhotoUri, setPendingPhotoUri] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: sessionUser?.name ?? '',
      cpf: formatCpf(sessionUser?.cpf ?? ''),
      phone: formatPhone(sessionUser?.phone ?? ''),
      password: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!sessionUser) return;

    setIsFetchingUser(true);
    getUser(sessionUser.id)
      .then((data) => {
        reset({
          name: data.name,
          cpf: formatCpf(data.cpf ?? ''),
          phone: formatPhone(data.phone),
          password: '',
        });
      })
      .catch(() => {
        // Mantém os dados do store em caso de falha
      })
      .finally(() => {
        setIsFetchingUser(false);
      });
  }, []);

  const onSubmit = async (data: EditProfileFormData) => {
    if (!sessionUser) return;

    try {
      let photo_url: string | undefined;
      if (pendingPhotoUri) {
        photo_url = await uploadPhoto(pendingPhotoUri);
      }

      const updated = await updateUser(sessionUser.id, {
        name: data.name,
        cpf: data.cpf,
        phone: onlyDigits(data.phone),
        ...(data.password ? { password: data.password } : {}),
        ...(photo_url ? { photo_url } : {}),
      });

      updateSessionUser({
        name: updated.name,
        phone: updated.phone,
        cpf: updated.cpf,
        photo_url: updated.photo_url,
      });

      setPendingPhotoUri(null);
      // localPhotoUri permanece no store para exibição ao navegar de volta
      reset({
        name: updated.name,
        cpf: formatCpf(updated.cpf ?? ''),
        phone: formatPhone(updated.phone),
        password: '',
      });

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
    } catch (error) {
      const message =
        error instanceof ApiError ? error.detail : 'Não foi possível salvar as alterações.';
      Alert.alert('Erro', message);
    }
  };

  const handleCancel = () => {
    setPendingPhotoUri(null);
    setLocalPhotoUri(null);
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
          <CircleIconButton
            icon="arrow-back"
            onPress={() => router.back()}
            style={styles.backCircleButton}
            accessibilityLabel="voltar"
          />

          <View style={styles.avatarWrap}>
            <EditableProfilePicture
              size={130}
              accessibilityLabel="Foto de perfil"
              imageUri={localPhotoUri ?? sessionUser?.photo_url}
              onImageChange={(uri) => {
                setPendingPhotoUri(uri);
                setLocalPhotoUri(uri);
              }}
              disabled={isFetchingUser}
            />
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
                    editable={!isFetchingUser}
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
                    editable={!isFetchingUser}
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
                    editable={!isFetchingUser}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppTextField
                    label="Nova senha"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    errorMessage={errors.password?.message}
                    secureTextEntry
                    autoComplete="password"
                    editable={!isFetchingUser}
                  />
                )}
              />
            </View>
          </View>
        </View>

        {(isDirty || !!pendingPhotoUri) && (
          <View style={styles.actions}>
            <PrimaryButton
              label="Salvar mudanças"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting || isFetchingUser}
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
    paddingBottom: 56,
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
