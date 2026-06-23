import { zodResolver } from '@hookform/resolvers/zod';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

import AppDialog from '@/components/general/app-dialog';
import { AppKeyboardAwareScrollView } from '@/components/general/app-keyboard-aware-scroll-view';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { AppTextField } from '@/components/general/app-text-field';
import { PrimaryButton } from '@/components/general/primary-button';
import { AuthHeader } from '@/components/auth/auth-header';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { useCreateUser } from '@/hooks/use-create-user';
import { formatCpf, formatPhone, isValidCpf, onlyDigits, PHONE_REGEX } from '@/lib/formatters';
import { ApiError } from '@/services/api';
import { useSessionStore } from '@/store/session.store';

enum RegisterBasicInfoErrorMessage {
  EMAIL_EMPTY = 'E-mail não pode ser vazio',
  EMAIL_INVALID = 'E-mail incorreto',
  EMAIL_ALREADY_EXISTS = 'E-mail já cadastrado',
  NAME_EMPTY = 'Nome não pode ser vazio',
  PHONE_EMPTY = 'Telefone não pode ser vazio',
  PHONE_INVALID = 'Telefone incorreto',
  PASSWORD_EMPTY = 'Senha não pode ser vazia',
  PASSWORD_TOO_SHORT = 'Senha deve ter pelo menos 6 caracteres',
  PASSWORD_NO_UPPERCASE = 'Senha deve conter ao menos uma letra maiúscula',
  PASSWORD_NO_SPECIAL = 'Senha deve conter ao menos um caractere especial',
  CPF_EMPTY = 'CPF não pode ser vazio',
  CPF_INVALID = 'CPF inválido',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registerBasicInfoSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, RegisterBasicInfoErrorMessage.EMAIL_EMPTY)
    .refine((value) => EMAIL_REGEX.test(value), {
      message: RegisterBasicInfoErrorMessage.EMAIL_INVALID,
    }),
  password: z
    .string()
    .trim()
    .min(1, RegisterBasicInfoErrorMessage.PASSWORD_EMPTY)
    .min(6, RegisterBasicInfoErrorMessage.PASSWORD_TOO_SHORT)
    .refine((v) => /[A-Z]/.test(v), RegisterBasicInfoErrorMessage.PASSWORD_NO_UPPERCASE)
    .refine((v) => /[^A-Za-z0-9]/.test(v), RegisterBasicInfoErrorMessage.PASSWORD_NO_SPECIAL),
  cpf: z.string().optional(),
  name: z.string().trim().min(1, RegisterBasicInfoErrorMessage.NAME_EMPTY),
  phone: z
    .string()
    .trim()
    .min(1, RegisterBasicInfoErrorMessage.PHONE_EMPTY)
    .refine((value) => PHONE_REGEX.test(value), {
      message: RegisterBasicInfoErrorMessage.PHONE_INVALID,
    }),
});

type RegisterBasicInfoFormData = z.infer<typeof registerBasicInfoSchema>;

type UserType = 'driver' | 'passenger';

export default function RegisterBasicInfoScreen() {
  const router = useRouter();
  const { userType } = useLocalSearchParams<{ userType?: string }>();
  const { mutateAsync, isPending } = useCreateUser();
  const setUser = useSessionStore((s) => s.setUser);
  const clearSession = useSessionStore((s) => s.clearSession);

  const [requiredDialogVisible, setRequiredDialogVisible] = useState(false);

  const resolvedUserType: UserType = userType === 'driver' ? 'driver' : 'passenger';
  const isDriver = resolvedUserType === 'driver';

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<RegisterBasicInfoFormData>({
    resolver: zodResolver(registerBasicInfoSchema),
    defaultValues: {
      email: '',
      password: '',
      cpf: '',
      name: '',
      phone: '',
    },
  });

  const watchedEmail = watch('email');
  const watchedPassword = watch('password');
  const watchedName = watch('name');
  const watchedPhone = watch('phone');
  const watchedCpf = watch('cpf');

  const handleLoginPress = () => {
    router.push('/login');
  };

  const onInvalid = () => {
    const baseEmpty =
      !watchedEmail.trim() &&
      !watchedPassword.trim() &&
      !watchedName.trim() &&
      !watchedPhone.trim();
    const allEmpty = isDriver ? baseEmpty && !watchedCpf?.trim() : baseEmpty;

    if (allEmpty) {
      setRequiredDialogVisible(true);
    }
  };

  const onSubmit = async (data: RegisterBasicInfoFormData) => {
    if (isDriver) {
      if (!data.cpf?.trim()) {
        setError('cpf', { type: 'manual', message: RegisterBasicInfoErrorMessage.CPF_EMPTY });
        return;
      }
      if (!isValidCpf(data.cpf)) {
        setError('cpf', { type: 'manual', message: RegisterBasicInfoErrorMessage.CPF_INVALID });
        return;
      }
    }

    try {
      const response = await mutateAsync({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: onlyDigits(data.phone),
        password: data.password,
        role: resolvedUserType,
        ...(isDriver && data.cpf ? { cpf: onlyDigits(data.cpf) } : {}),
      });

      // Garante que tokens de sessão anteriores não vazem para o novo usuário
      clearSession();
      setUser({
        id: response.id,
        name: response.name,
        email: response.email,
        phone: response.phone,
        cpf: response.cpf,
        role: response.role,
        photo_url: response.photo_url,
      });

      const nextRoute =
        resolvedUserType === 'driver'
          ? '/register-driver-details-screen'
          : '/register-passenger-details';

      router.push({ pathname: nextRoute, params: { userId: response.id } } as never);
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        setError('email', {
          type: 'manual',
          message: RegisterBasicInfoErrorMessage.EMAIL_ALREADY_EXISTS,
        });
        return;
      }

      if (error instanceof ApiError && error.status === 422) {
        const details = Array.isArray(error.detail) ? error.detail : [];
        for (const item of details) {
          const loc: string[] = item?.loc ?? [];
          const msg: string = (item?.msg ?? '').replace(/^Value error,\s*/i, '');
          if (loc.includes('password')) {
            setError('password', { type: 'manual', message: msg });
            return;
          }
          if (loc.includes('email')) {
            setError('email', { type: 'manual', message: msg });
            return;
          }
        }
        const firstMsg = details[0]?.msg?.replace(/^Value error,\s*/i, '');
        setError('email', { type: 'manual', message: firstMsg ?? 'Dados inválidos' });
        return;
      }

      const errorMessage =
        error instanceof ApiError && typeof error.detail === 'string'
          ? error.detail
          : 'Erro ao criar usuário';

      setError('email', { type: 'manual', message: errorMessage });
    }
  };

  return (
    <AppScreenContainer
      backgroundColor={colors.primary}
      style={styles.container}
      edges={['right', 'bottom', 'left']}
    >
      <View style={styles.topSection}>
        <AuthHeader title="Cadastro" subtitle="Comece sua jornada na VanGO" showBackButton />
      </View>

      <AppKeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentCard}
      >
        <View style={styles.formContent}>
          <Text style={styles.sectionTitle}>Conta</Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <AppTextField
                label="E-mail"
                placeholder="nome@gmail.com"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <AppTextField
                label="Senha"
                placeholder="Mínimo 6 caracteres"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                errorMessage={errors.password?.message}
              />
            )}
          />

          {isDriver && (
            <Controller
              control={control}
              name="cpf"
              render={({ field: { onChange, value } }) => (
                <AppTextField
                  label="CPF"
                  placeholder="999.999.999-99"
                  value={value}
                  onChangeText={(text) => onChange(formatCpf(text))}
                  keyboardType="number-pad"
                  maxLength={14}
                  errorMessage={errors.cpf?.message}
                />
              )}
            />
          )}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Contato</Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <AppTextField
                label="Nome"
                placeholder="Nome"
                value={value}
                onChangeText={onChange}
                autoCapitalize="words"
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <AppTextField
                label="Telefone"
                placeholder="+55 51 99999-9999"
                value={value}
                onChangeText={(text) => {
                  const formatted = formatPhone(text);
                  onChange(formatted);
                  if (formatted.length === 17) Keyboard.dismiss();
                }}
                keyboardType="phone-pad"
                maxLength={17}
                errorMessage={errors.phone?.message}
              />
            )}
          />
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            label="Continuar"
            onPress={handleSubmit(onSubmit, onInvalid)}
            disabled={isPending}
            icon={<MaterialIcons name="arrow-forward" size={18} color={colors.light} />}
            labelColor={colors.light}
            style={styles.continueButton}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <Pressable onPress={handleLoginPress}>
              <Text style={styles.loginLink}>Login</Text>
            </Pressable>
          </View>
        </View>
      </AppKeyboardAwareScrollView>

      <AppDialog
        visible={requiredDialogVisible}
        onRequestClose={() => setRequiredDialogVisible(false)}
        title="Campos obrigatórios"
        description="Preencha todos os campos para continuar com o cadastro."
        actions={[
          {
            label: 'Ok',
            onPress: () => setRequiredDialogVisible(false),
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
    flex: 1,
  },
  topSection: {
    backgroundColor: colors.primary,
    marginTop: -24,
    marginHorizontal: -24,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 52,
    gap: 16,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginHorizontal: -24,
    marginBottom: -100,
  },
  contentCard: {
    flexGrow: 1,
    paddingHorizontal: 64,
    paddingTop: 24,
    paddingBottom: 80,
    justifyContent: 'space-between',
  },
  formContent: {
    gap: 16,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.dark,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.accent,
    marginVertical: 4,
  },
  footer: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 24,
  },
  continueButton: {
    alignSelf: 'center',
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    ...typography.small,
    color: colors.dark,
  },
  loginLink: {
    ...typography.smallBold,
    color: colors.dark,
    textDecorationLine: 'underline',
  },
});
