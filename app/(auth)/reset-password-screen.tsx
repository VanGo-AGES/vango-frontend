import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

import { AppKeyboardAwareScrollView } from '@/components/general/app-keyboard-aware-scroll-view';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { AppTextField } from '@/components/general/app-text-field';
import { PrimaryButton } from '@/components/general/primary-button';
import { useResetPassword } from '@/hooks/use-reset-password';
import { colors, withAlpha } from '@/styles/colors';
import { typography } from '@/styles/typography';

import ForgotPasswordIllustration from '@/assets/images/forgot-password.svg';

enum ResetPasswordErrorMessage {
  TOKEN_EMPTY = 'Código não pode ser vazio',
  PASSWORD_EMPTY = 'Senha não pode ser vazia',
  PASSWORD_TOO_SHORT = 'Senha deve ter pelo menos 6 caracteres',
  PASSWORD_NO_UPPERCASE = 'Senha deve conter ao menos uma letra maiúscula',
  PASSWORD_NO_SPECIAL = 'Senha deve conter ao menos um caractere especial',
  PASSWORD_CONFIRM_EMPTY = 'Confirmação não pode ser vazia',
  PASSWORD_MISMATCH = 'As senhas não coincidem',
  GENERIC = 'Token inválido ou expirado. Solicite um novo código.',
}

const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, ResetPasswordErrorMessage.TOKEN_EMPTY),
    new_password: z
      .string()
      .trim()
      .min(1, ResetPasswordErrorMessage.PASSWORD_EMPTY)
      .min(6, ResetPasswordErrorMessage.PASSWORD_TOO_SHORT)
      .refine((v) => /[A-Z]/.test(v), ResetPasswordErrorMessage.PASSWORD_NO_UPPERCASE)
      .refine((v) => /[^A-Za-z0-9]/.test(v), ResetPasswordErrorMessage.PASSWORD_NO_SPECIAL),
    confirm_password: z.string().trim().min(1, ResetPasswordErrorMessage.PASSWORD_CONFIRM_EMPTY),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: ResetPasswordErrorMessage.PASSWORD_MISMATCH,
    path: ['confirm_password'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [successVisible, setSuccessVisible] = useState(false);
  const { mutateAsync, isPending } = useResetPassword();

  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: '', new_password: '', confirm_password: '' },
  });

  const handleBackPress = () => {
    router.back();
  };

  const handleLoginPress = () => {
    setSuccessVisible(false);
    router.replace('/login');
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await mutateAsync({ token: data.token.trim(), new_password: data.new_password });
      setSuccessVisible(true);
    } catch {
      setError('token', {
        type: 'manual',
        message: ResetPasswordErrorMessage.GENERIC,
      });
    }
  };

  return (
    <AppScreenContainer edges={['top', 'right', 'bottom', 'left']} style={styles.container}>
      <AppKeyboardAwareScrollView
        style={styles.keyboardContainer}
        contentContainerStyle={styles.keyboardContent}
      >
        <Pressable
          onPress={handleBackPress}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="voltar"
        >
          <MaterialIcons name="arrow-back" size={26} color={colors.dark} />
        </Pressable>

        <View style={styles.content}>
          <View style={styles.illustrationWrapper}>
            <ForgotPasswordIllustration width={170} height={170} />
          </View>

          <View style={styles.textBlock}>
            <Text style={styles.title}>Redefinir senha</Text>
            <Text style={styles.subtitle}>
              Cole o código recebido por e-mail e escolha uma nova senha.
            </Text>
          </View>

          <View style={styles.formBlock}>
            <Controller
              control={control}
              name="token"
              render={({ field: { onChange, value } }) => (
                <AppTextField
                  label="Código recebido por e-mail"
                  placeholder="Cole o código aqui"
                  value={value}
                  onChangeText={(text) => {
                    if (errors.token) clearErrors('token');
                    onChange(text);
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="off"
                  textContentType="oneTimeCode"
                  errorMessage={errors.token?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="new_password"
              render={({ field: { onChange, value } }) => (
                <AppTextField
                  label="Nova senha"
                  placeholder="Mínimo 6 caracteres"
                  value={value}
                  onChangeText={(text) => {
                    if (errors.new_password) clearErrors('new_password');
                    onChange(text);
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="off"
                  textContentType="none"
                  errorMessage={errors.new_password?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="confirm_password"
              render={({ field: { onChange, value } }) => (
                <AppTextField
                  label="Confirmar nova senha"
                  placeholder="Repita a nova senha"
                  value={value}
                  onChangeText={(text) => {
                    if (errors.confirm_password) clearErrors('confirm_password');
                    onChange(text);
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="off"
                  textContentType="none"
                  errorMessage={errors.confirm_password?.message}
                />
              )}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            label="Redefinir senha"
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            variant="secondary"
            icon={<MaterialIcons name="lock-reset" size={18} color={colors.light} />}
            style={styles.button}
          />
        </View>
      </AppKeyboardAwareScrollView>

      <Modal
        visible={successVisible}
        transparent
        animationType="fade"
        onRequestClose={handleLoginPress}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Senha redefinida!</Text>
              <Text style={styles.modalBody}>
                Sua senha foi alterada com sucesso. Faça login com a nova senha.
              </Text>
            </View>

            <View style={styles.modalDivider} />

            <Pressable
              onPress={handleLoginPress}
              style={styles.modalAction}
              accessibilityRole="button"
            >
              <MaterialIcons name="check" size={18} color={colors.secondary} />
              <Text style={styles.modalActionText}>Ir para o login</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  keyboardContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    paddingTop: 8,
    paddingBottom: 40,
  },
  illustrationWrapper: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
    maxWidth: 320,
  },
  title: {
    ...typography.header3,
    color: colors.dark,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.dark,
    textAlign: 'center',
  },
  formBlock: {
    width: '100%',
    paddingHorizontal: 30,
    maxWidth: 360,
    gap: 16,
  },
  footer: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 16,
  },
  button: {
    alignSelf: 'stretch',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: withAlpha(colors.dark, 0.5),
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
  },
  modalHeader: {
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 20,
    gap: 12,
  },
  modalTitle: {
    ...typography.header3,
    color: colors.dark,
    textAlign: 'center',
  },
  modalBody: {
    ...typography.body,
    color: colors.text,
    textAlign: 'left',
  },
  modalDivider: {
    height: 1,
    backgroundColor: colors.accent,
  },
  modalAction: {
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  modalActionText: {
    ...typography.bodyBold,
    color: colors.secondary,
  },
});
