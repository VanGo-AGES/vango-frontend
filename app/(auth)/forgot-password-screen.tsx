import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppKeyboardAwareScrollView } from '@/components/general/app-keyboard-aware-scroll-view';
import { z } from 'zod';

import ForgotPasswordIllustration from '@/assets/images/forgot-password.svg';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { AppTextField } from '@/components/general/app-text-field';
import { PrimaryButton } from '@/components/general/primary-button';
import { useForgotPassword } from '@/hooks/use-forgot-password';
import { colors, withAlpha } from '@/styles/colors';
import { typography } from '@/styles/typography';

enum ForgotPasswordErrorMessage {
  EMAIL_EMPTY = 'E-mail não pode ser vazio',
  EMAIL_INVALID = 'E-mail incorreto',
  GENERIC = 'Não foi possível enviar o e-mail. Tente novamente.',
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, ForgotPasswordErrorMessage.EMAIL_EMPTY)
    .refine((value) => EMAIL_REGEX.test(value), {
      message: ForgotPasswordErrorMessage.EMAIL_INVALID,
    }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [successVisible, setSuccessVisible] = useState(false);
  const { mutateAsync, isPending } = useForgotPassword();

  const {
    control,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const handleBackPress = () => {
    router.back();
  };

  const handleSignUpPress = () => {
    router.push('/register-profile-selection-screen');
  };

  const handleOkPress = () => {
    setSuccessVisible(false);
    router.push('/reset-password-screen');
  };

  const onSubmit = async (data: ForgotPasswordFormData) => {
    const email = data.email.trim().toLowerCase();

    try {
      await mutateAsync({ email });
      setSuccessVisible(true);
    } catch {
      setError('email', {
        type: 'manual',
        message: ForgotPasswordErrorMessage.GENERIC,
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
            <Text style={styles.title}>Esqueceu a senha?</Text>
            <Text style={styles.subtitle}>
              Sem problemas! Insira seu e-mail para receber as instruções.
            </Text>
          </View>

          <View style={styles.formBlock}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <AppTextField
                  label="E-mail"
                  placeholder="nome@gmail.com"
                  value={value}
                  onChangeText={(text) => {
                    if (errors.email) {
                      clearErrors('email');
                    }
                    onChange(text);
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  errorMessage={errors.email?.message}
                />
              )}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            label="Enviar"
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            variant="secondary"
            icon={<MaterialIcons name="send" size={18} color={colors.light} />}
            style={styles.button}
          />

          <View style={styles.signUpRow}>
            <Text style={styles.signUpText}>Não tem uma conta? </Text>
            <Pressable onPress={handleSignUpPress}>
              <Text style={styles.signUpLink}>Cadastre-se</Text>
            </Pressable>
          </View>
        </View>
      </AppKeyboardAwareScrollView>

      <Modal
        visible={successVisible}
        transparent
        animationType="fade"
        onRequestClose={handleOkPress}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>E-mail enviado!</Text>
              <Text style={styles.modalBody}>
                Confira sua caixa de entrada e copie o código recebido.
              </Text>
              <Text style={styles.modalTip}>
                Dica: Se não encontrar, dê uma olhada na pasta de spam.
              </Text>
            </View>

            <View style={styles.modalDivider} />

            <Pressable
              onPress={handleOkPress}
              style={styles.modalAction}
              accessibilityRole="button"
            >
              <MaterialIcons name="check" size={18} color={colors.secondary} />
              <Text style={styles.modalActionText}>Inserir código</Text>
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
    marginTop: 40,
  },
  footer: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 16,
  },
  button: {
    alignSelf: 'stretch',
  },
  signUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
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
  modalTip: {
    ...typography.body,
    color: colors.text,
    fontStyle: 'italic',
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
