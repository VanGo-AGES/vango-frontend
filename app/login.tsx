import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/schemas/login.schema';

import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

//import { useMutation } from '@tanstack/react-query';

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  /*

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: LoginFormData) =>
      fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((res) => res.json()),

    onSuccess: (response) => {
      // salvar token, navegar para o mapa
    },

    onError: (error) => {
      // mostrar mensagem de erro
    },
  });

  */

  return (
    <View style={styles.container}>
      <Text style={styles.title}> VanGo </Text>

      <View style={styles.fieldContainer}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="E-mail"
              placeholder="Digite aqui o seu email"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.textInput}
            />
          )}
        />
        {errors.email && <Text style={{ color: colors.primary }}>{errors.email.message}</Text>}
      </View>

      <View style={styles.fieldContainer}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              label="Senha"
              placeholder="Digite aqui a sua senha"
              value={value}
              onChangeText={onChange}
              autoCapitalize="none"
              secureTextEntry
              style={styles.textInput}
            />
          )}
        />
        {errors.password && (
          <Text style={{ color: colors.primary }}>{errors.password.message}</Text>
        )}
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit((data) => console.log(data))}
        //onPress={handleSubmit(mutate)}
        style={styles.button}
        textColor={colors.dark}
      >
        Fazer login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.dark,
  },
  textInput: {
    marginBottom: 6,
  },
  button: {
    backgroundColor: colors.primary,
  },
  title: {
    ...typography.header2,
    color: colors.primary,
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
});
