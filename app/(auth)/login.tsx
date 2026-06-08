import { zodResolver } from '@hookform/resolvers/zod';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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

export default function LoginScreen() {
  const router = useRouter();
  const { mutateAsync, isPending } = useLogin();

  const [requiredDialogVisible, setRequiredDialogVisible] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const watchedEmail = watch('email');
  const watchedPassword = watch('password');

  const onInvalid = () => {
    const allFieldsEmpty = !watchedEmail.trim() && !watchedPassword.trim();
    if (allFieldsEmpty) {
      setRequiredDialogVisible(true);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await mutateAsync({
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      const nextRoute = response.role === 'driver' ? '/driver-home' : '/passenger-home-screen';
      router.dismissAll();
      router.replace(nextRoute as never);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setError('email', {
          type: 'manual',
          message: LoginErrorMessage.EMAIL_NOT_REGISTERED,
        });
        return;
      }

      if (error instanceof ApiError && error.status === 401) {
        setError('password', {
          type: 'manual',
          message: LoginErrorMessage.PASSWORD_INCORRECT,
        });
        return;
      }

      const fallback =
        error instanceof ApiError && typeof error.detail === 'string'
          ? error.detail
          : 'Não foi possível fazer login. Tente novamente.';
      setError('password', { type: 'manual', message: fallback });
    }
  };

  const handleSignUpPress = () => {
    router.push('/register-profile-selection-screen');
  };

  const handleForgotPasswordPress = () => {
    // TODO: ligar à tela de recuperação de senha quando ela existir.
  };

  return (
    <AppScreenContainer
      backgroundColor={colors.primary}
      style={styles.container}
      edges={['right', 'bottom', 'left']}
    >
      <View style={styles.topSection}>
        <AuthHeader
          title="Login"
          subtitle="Acesse sua conta para gerenciar suas viagens"
          showBackButton
        />
      </View>

      <View style={styles.contentCard}>
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
                placeholder="Senha"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Pressable onPress={handleForgotPasswordPress} style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
          </Pressable>
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
    paddingTop: 36,
    paddingBottom: 52,
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
  forgotPasswordText: {
    ...typography.small,
    color: colors.dark,
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
