import { zodResolver } from '@hookform/resolvers/zod';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { z } from 'zod';

import AppDialog from '@/components/general/app-dialog';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { AppTextField } from '@/components/general/app-text-field';
import { PrimaryButton } from '@/components/general/primary-button';
import { AuthHeader } from '@/components/auth/auth-header';
import { useLogin } from '@/hooks/use-login';
import { ApiError } from '@/services/api';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

enum LoginErrorMessage {
  EMAIL_EMPTY = 'E-mail não pode ser vazio',
  EMAIL_INVALID = 'E-mail incorreto',
  EMAIL_NOT_REGISTERED = 'Usuário não cadastrado',
  PASSWORD_EMPTY = 'Senha não pode ser vazia',
  PASSWORD_INCORRECT = 'Senha incorreta',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, LoginErrorMessage.EMAIL_EMPTY)
    .refine((value) => EMAIL_REGEX.test(value), {
      message: LoginErrorMessage.EMAIL_INVALID,
    }),
  password: z.string().trim().min(1, LoginErrorMessage.PASSWORD_EMPTY),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

function collectErrorTexts(value: unknown, seen = new Set<object>()): string[] {
  if (typeof value === 'string') {
    return [value];
  }

  if (!value || typeof value !== 'object') {
    return [];
  }

  if (seen.has(value)) {
    return [];
  }

  seen.add(value);

  const record = value as Record<string, unknown>;
  return Object.values(record).flatMap((item) => collectErrorTexts(item, seen));
}

function normalizeErrorTexts(error: unknown): string[] {
  if (error instanceof ApiError) {
    return collectErrorTexts(error.detail).map((text) => text.trim().toLowerCase());
  }

  if (error instanceof Error) {
    return [
      error.message.trim().toLowerCase(),
      ...collectErrorTexts(error).map((text) => text.trim().toLowerCase()),
    ];
  }

  return collectErrorTexts(error).map((text) => text.trim().toLowerCase());
}

function isEmailNotRegisteredError(error: unknown): boolean {
  const details = normalizeErrorTexts(error);

  return details.some(
    (detail) =>
      detail.includes('usuário não cadastrado') ||
      detail.includes('usuario nao cadastrado') ||
      detail.includes('e-mail não cadastrado') ||
      detail.includes('email nao cadastrado') ||
      detail.includes('e-mail não registrado') ||
      detail.includes('email nao registrado') ||
      detail.includes('usuário não registrado') ||
      detail.includes('usuario nao registrado') ||
      detail.includes('not registered') ||
      detail.includes('not found') ||
      (detail.includes('cadastrado') && detail.includes('email')),
  );
}

function isIncorrectPasswordError(error: unknown): boolean {
  const details = normalizeErrorTexts(error);

  return details.some(
    (detail) =>
      detail.includes('senha incorreta') ||
      detail.includes('senha inválida') ||
      detail.includes('senha invalida') ||
      detail.includes('wrong password') ||
      detail.includes('invalid credentials') ||
      detail.includes('authentication failed') ||
      (detail.includes('senha') && detail.includes('erro')),
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const { mutateAsync, isPending } = useLogin();

  const [requiredDialogVisible, setRequiredDialogVisible] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const watchedEmail = watch('email');
  const watchedPassword = watch('password');
  const hasPasswordError = !!errors.password;

  const onInvalid = () => {
    if (!watchedEmail.trim() || !watchedPassword.trim()) {
      clearErrors(['email', 'password']);
      setRequiredDialogVisible(true);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearErrors(['email', 'password']);
      const response = await mutateAsync({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      const nextRoute = response.role === 'driver' ? '/driver-home' : '/passenger-home-screen';
      router.dismissAll();
      router.replace(nextRoute as never);
    } catch (error) {
      // (debug capture removed) error handling continues below
      if (isEmailNotRegisteredError(error) || (error instanceof ApiError && error.status === 404)) {
        clearErrors('password');
        setError('email', {
          type: 'manual',
          message: LoginErrorMessage.EMAIL_NOT_REGISTERED,
        });
        return;
      }

      if (isIncorrectPasswordError(error) || (error instanceof ApiError && error.status === 401)) {
        clearErrors('email');
        setError('password', {
          type: 'manual',
          message: LoginErrorMessage.PASSWORD_INCORRECT,
        });
        return;
      }

      if (error instanceof ApiError && typeof error.detail === 'string') {
        clearErrors('email');
        setError('password', { type: 'manual', message: error.detail });
        return;
      }

      clearErrors('email');
      setError('password', {
        type: 'manual',
        message: 'Não foi possível fazer login. Tente novamente.',
      });
    }
  };

  const handleSignUpPress = () => {
    router.push('/register-profile-selection-screen');
  };

  const handleForgotPasswordPress = () => {
    router.push('/forgot-password-screen');
  };

  return (
    <AppScreenContainer
      backgroundColor={colors.primary}
      style={styles.container}
      edges={['right', 'bottom', 'left']}
    >
      <View style={styles.topSection}>
        <AuthHeader
          title="Bem-vindo de volta!"
          subtitle={'Acesse sua conta para\ngerenciar suas viagens'}
          showBackButton={false}
        />
      </View>

      <View style={styles.contentCard}>
        <View style={styles.formContent}>
          <Text style={styles.sectionTitle}>Faça seu login:</Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => {
              const handleEmailChange = (text: string) => {
                if (errors.email) {
                  clearErrors('email');
                }

                onChange(text);
              };

              return (
                <AppTextField
                  label="E-mail"
                  placeholder="nome@gmail.com"
                  value={value}
                  onChangeText={handleEmailChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  errorMessage={errors.email?.message}
                  placeholderTextColor={colors.subtleText}
                  outlineColor={errors.email ? colors.destructive : colors.dark}
                  activeOutlineColor={errors.email ? colors.destructive : colors.dark}
                  right={
                    errors.email ? (
                      <TextInput.Icon icon="alert-circle" color={colors.destructive} />
                    ) : undefined
                  }
                />
              );
            }}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => {
              const handlePasswordChange = (text: string) => {
                if (errors.password) {
                  clearErrors('password');
                }

                onChange(text);
              };

              return (
                <AppTextField
                  label="Senha"
                  placeholder="••••••••"
                  value={value}
                  onChangeText={handlePasswordChange}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  errorMessage={hasPasswordError ? undefined : errors.password?.message}
                  placeholderTextColor={colors.subtleText}
                  outlineColor={hasPasswordError ? colors.destructive : colors.dark}
                  activeOutlineColor={hasPasswordError ? colors.destructive : colors.dark}
                  right={
                    hasPasswordError ? (
                      <TextInput.Icon icon="alert-circle" color={colors.destructive} />
                    ) : undefined
                  }
                />
              );
            }}
          />

          {hasPasswordError ? (
            <View style={styles.passwordErrorRow}>
              <Text style={styles.passwordErrorText}>{errors.password?.message}</Text>
              <Pressable
                onPress={handleForgotPasswordPress}
                style={styles.forgotPasswordInlineButton}
              >
                <Text style={styles.forgotPasswordInlineText}>Esqueci minha senha</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={handleForgotPasswordPress} style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            label="Login"
            onPress={handleSubmit(onSubmit, onInvalid)}
            disabled={isPending}
            icon={<MaterialIcons name="arrow-forward" size={18} color={colors.light} />}
            labelColor={colors.light}
            style={styles.loginButton}
          />

          <View style={styles.signUpRow}>
            <Text style={styles.signUpText}>Não tem uma conta? </Text>
            <Pressable onPress={handleSignUpPress}>
              <Text style={styles.signUpLink}>Cadastre-se</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <AppDialog
        visible={requiredDialogVisible}
        onRequestClose={() => setRequiredDialogVisible(false)}
        title="Campos obrigatórios"
        description="Você deve preencher os campos de usuário e senha."
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
    paddingTop: 80,
    paddingBottom: 36,
    minHeight: 320,
    justifyContent: 'center',
    gap: 16,
  },
  contentCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginHorizontal: -24,
    marginBottom: -80,
    paddingHorizontal: 64,
    paddingTop: 24,
    paddingBottom: 64,
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
  forgotPasswordButton: {
    alignSelf: 'flex-start',
    paddingTop: 4,
  },
  passwordErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 2,
  },
  passwordErrorText: {
    ...typography.small,
    color: colors.destructive,
  },
  forgotPasswordInlineButton: {
    paddingTop: 0,
  },
  forgotPasswordInlineText: {
    ...typography.small,
    color: colors.dark,
    textDecorationLine: 'underline',
  },
  forgotPasswordText: {
    ...typography.small,
    color: colors.dark,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 16,
  },
  loginButton: {
    alignSelf: 'center',
  },
  signUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpText: {
    ...typography.small,
    color: colors.dark,
  },
  signUpLink: {
    ...typography.smallBold,
    color: colors.dark,
    textDecorationLine: 'underline',
  },
});
