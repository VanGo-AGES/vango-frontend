/**
 * TELA DE EXEMPLO — Guia de desenvolvimento do VanGo
 *
 * Este arquivo demonstra os padrões que devem ser seguidos em todas as telas.
 * Leia os comentários numerados em ordem para entender o fluxo completo.
 */

// 3. Imports externos sempre antes dos internos.
//    Agrupe: (a) libs React/RN, (b) libs de terceiros, (c) imports internos com @/.
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';

// 4. Imports internos sempre com o alias @/ — nunca com caminhos relativos (../../).
import { exampleFormSchema, type ExampleFormData } from '@/schemas/example-form';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export default function ExemploScreen() {
  const router = useRouter();

  // 5. useForm recebe o resolver Zod e os valores padrão.
  //    O tipo genérico vem do z.infer<> definido no schema — sem duplicação.
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExampleFormData>({
    resolver: zodResolver(exampleFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 6. A função de submit só é chamada se o Zod validar com sucesso.
  //    Aqui entraria a chamada à API via TanStack Query (useMutation).
  const onSubmit = (data: ExampleFormData) => {
    // eslint-disable-next-line no-console
    console.log('Dados validados:', data);
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* 7. Tipografia: sempre via tokens de @/styles/typography. Nunca fontSize hardcoded. */}
      <Text style={styles.title}>Exemplo de Tela</Text>
      <Text style={styles.subtitle}>Formulário com React Hook Form + Zod</Text>

      {/* 8. Controller é o wrapper do React Hook Form para componentes controlados.
              Ele conecta o campo ao estado do formulário sem re-renders desnecessários. */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <View style={styles.fieldWrapper}>
            <TextInput
              label="E-mail"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errors.email}
              style={styles.input}
            />
            {/* 9. HelperText exibe a mensagem de erro do Zod quando o campo é inválido. */}
            <HelperText type="error" visible={!!errors.email}>
              {errors.email?.message}
            </HelperText>
          </View>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <View style={styles.fieldWrapper}>
            <TextInput
              label="Senha"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              error={!!errors.password}
              style={styles.input}
            />
            <HelperText type="error" visible={!!errors.password}>
              {errors.password?.message}
            </HelperText>
          </View>
        )}
      />

      {/* 10. handleSubmit intercepta o submit, roda a validação Zod e só chama
               onSubmit se tudo estiver válido. isSubmitting bloqueia duplo clique. */}
      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={isSubmitting}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Entrar
      </Button>
    </View>
  );
}

// 11. Estilos sempre no final do arquivo, fora do componente.
//     Cores via tokens de @/styles/colors — nunca HEX direto no StyleSheet.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
    padding: 24,
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    ...typography.header3,
    color: colors.dark,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.body,
    color: colors.subtleText,
    marginBottom: 24,
  },
  fieldWrapper: {
    gap: 0,
  },
  input: {
    backgroundColor: colors.light,
  },
  button: {
    backgroundColor: colors.primary,
    marginTop: 16,
    borderRadius: 8,
  },
  buttonLabel: {
    ...typography.buttonText,
    color: colors.dark,
  },
});
