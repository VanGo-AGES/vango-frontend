import { zodResolver } from '@hookform/resolvers/zod';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { z } from 'zod';

import { AppScreenContainer } from '@/components/general/app-screen-container';
import { AppTextField } from '@/components/general/app-text-field';
import { PrimaryButton } from '@/components/general/primary-button';
import { RouteStepIndicator } from '@/components/route/route-step-indicator';
import { RouteTypeSelectField, type RouteType } from '@/components/route/route-type-select-field';
import { useRouteFormStore } from '@/store/route-form.store';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

enum CreateRouteInfoErrorMessage {
  ROUTE_NAME_EMPTY = 'Nome não pode ser vazio',
  ROUTE_TYPE_EMPTY = 'Tipo de rota é obrigatório',
}

const schema = z.object({
  routeName: z.string().trim().min(1, CreateRouteInfoErrorMessage.ROUTE_NAME_EMPTY),
  routeType: z.enum(['Ida', 'Volta'], {
    message: CreateRouteInfoErrorMessage.ROUTE_TYPE_EMPTY,
  }),
});

type FormData = z.infer<typeof schema>;

export default function CreateRouteInfoScreen() {
  const router = useRouter();
  const setRouteInfo = useRouteFormStore((state) => state.setRouteInfo);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      routeName: '',
      routeType: undefined as unknown as RouteType,
    },
  });

  const onSubmit = (data: FormData) => {
    setRouteInfo({ routeName: data.routeName, routeType: data.routeType });
    router.push('/create-route-origin-screen');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <AppScreenContainer
        backgroundColor={colors.accent}
        edges={['top', 'left', 'right']}
        style={styles.container}
      >
        <View style={styles.headerArea}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="voltar"
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          >
            <MaterialIcons name="arrow-back" size={22} color={colors.dark} />
          </Pressable>

          <Text style={styles.title}>Criar Rota</Text>
          <Text style={styles.subtitle}>Preencha as informações{`\n`}para criar sua rota.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardContent}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.formContent}>
                <Text style={styles.sectionTitle}>Informações da rota</Text>

                <Controller
                  control={control}
                  name="routeName"
                  render={({ field: { onChange, value } }) => (
                    <AppTextField
                      label="Nome"
                      placeholder="Nome da rota"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="words"
                      autoCorrect={false}
                      errorMessage={errors.routeName?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="routeType"
                  render={({ field: { onChange, value } }) => (
                    <RouteTypeSelectField
                      value={value}
                      onChange={onChange}
                      error={errors.routeType?.message}
                    />
                  )}
                />
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <View style={styles.routeStepIndicatorWrapper}>
                <RouteStepIndicator currentStep={1} totalSteps={4} />
              </View>

              <PrimaryButton
                label="Continuar"
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                icon={<MaterialIcons name="arrow-forward" size={18} color={colors.light} />}
                labelColor={colors.light}
                style={styles.continueButton}
              />
            </View>
          </View>
        </View>
      </AppScreenContainer>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  headerArea: {
    paddingTop: 8,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    opacity: 0.65,
  },
  title: {
    ...typography.subtitle,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.dark,
    textAlign: 'center',
  },
  card: {
    marginTop: 32,
    flex: 1,
    backgroundColor: colors.light,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 64,
    paddingTop: 32,
    paddingBottom: 24,
  },
  cardContent: {
    flex: 1,
  },
  formContent: {
    gap: 16,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.dark,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 36,
    gap: 32,
  },
  routeStepIndicatorWrapper: {
    alignSelf: 'center',
    marginBottom: -6,
    transform: [{ scale: 0.75 }],
  },
  continueButton: {
    alignSelf: 'center',
    marginBottom: 24,
  },
});
