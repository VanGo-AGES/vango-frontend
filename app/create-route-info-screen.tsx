import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { AppTextField } from '@/components/app-text-field';
import { PrimaryButton } from '@/components/primary-button';
import { RouteTypeSelectField, RouteType } from '@/components/route-type-select-field';
import { AppScreenContainer } from '@/components/ui/app-screen-container';
import { RouteStepIndicator } from '@/components/ui/route-step-indicator';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { SectionHeader } from '@/components/ui/section-header';

const schema = z.object({
  routeName: z.string().min(1, 'O nome da rota não pode estar vazio'),
  routeType: z
    .string()
    .min(1, 'O tipo da rota não pode estar vazio')
    .transform((val) => val as RouteType),
});

type FormData = z.infer<typeof schema>;

export default function CreateRouteInfoScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      routeName: '',
      routeType: undefined,
    },
  });

  const onSubmit = (data: FormData) => {};

  return (
    <AppScreenContainer backgroundColor={colors.accent} style={styles.screenContainer}>
      <SectionHeader
        title="Criar Rota"
        subtitle="Preencha as informações para criar sua rota."
        showBackButton
      />
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Informações</Text>
        <View style={styles.cardContent}>
          <View style={styles.fieldsContainer}>
            <Controller
              control={control}
              name="routeName"
              render={({ field: { onChange, value } }) => (
                <AppTextField
                  label="Nome"
                  value={value}
                  onChangeText={onChange}
                  error={errors.routeName?.message}
                  placeholder="Nome da Rota"
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

          <View style={styles.footer}>
            <View style={styles.routeStepIndicatorWrapper}>
              <RouteStepIndicator currentStep={1} totalSteps={4} />
            </View>

            <PrimaryButton
              label="Continuar"
              onPress={handleSubmit(onSubmit)}
              labelColor={colors.light}
              icon={<MaterialIcons name="arrow-forward" size={18} color={colors.light} />}
              style={styles.nextButton}
            />
          </View>
        </View>
      </View>
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    paddingBottom: 0,
  },
  card: {
    marginTop: 32,
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 20,
    marginHorizontal: -24,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 12,
  },
  fieldsContainer: {
    gap: 16,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    gap: 24,
  },
  routeStepIndicatorWrapper: {
    alignSelf: 'center',
    marginBottom: -6,
    transform: [{ scale: 0.75 }],
  },
  nextButton: {
    alignSelf: 'center',
  },
});
