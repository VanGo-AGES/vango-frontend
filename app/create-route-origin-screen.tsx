import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import {
  AddressFormSection,
  type AddressFields,
  type AddressErrors,
} from '@/components/ui/address-form-section';
import { AppScreenContainer } from '@/components/ui/app-screen-container';
import { RouteStepIndicator } from '@/components/ui/route-step-indicator';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export default function CreateRouteOriginScreen() {
  const router = useRouter();

  const [address, setAddress] = useState<AddressFields>({
    cep: '90619900',
    numero: '6681',
    rua: 'Av. Ipiranga',
    bairro: '',
    cidade: 'Porto Alegre',
  });
  const [errors, setErrors] = useState<AddressErrors>({});

  const handleChange = (field: keyof AddressFields, text: string) => {
    setAddress((prev) => ({ ...prev, [field]: text }));
  };

  const validateForm = () => {
    const nextErrors: AddressErrors = {};

    (Object.keys(address) as (keyof AddressFields)[]).forEach((field) => {
      if (!address[field].trim()) {
        nextErrors[field] = 'Este campo é obrigatório.';
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) return;
    router.push('/create-route-destination-screen');
  };

  return (
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
          <ScrollView showsVerticalScrollIndicator={false}>
            <AddressFormSection
              title="Endereço de Origem"
              value={address}
              onChange={handleChange}
              errors={errors}
            />
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.routeStepIndicatorWrapper}>
              <RouteStepIndicator currentStep={2} totalSteps={4} />
            </View>

            <PrimaryButton
              label="Continuar"
              onPress={handleContinue}
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
  nextButton: {
    alignSelf: 'center',
    marginBottom: 24,
  },
});
