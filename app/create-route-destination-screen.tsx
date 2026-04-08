import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppTextField } from '@/components/app-text-field';
import { PrimaryButton } from '@/components/primary-button';
import { RouteStepIndicator } from '@/components/ui/route-step-indicator';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export type FieldName = 'cep' | 'numero' | 'rua' | 'bairro' | 'cidade';

export default function CreateRouteDestinationScreen() {
  const router = useRouter();

  const [cep, setCep] = useState('90619-900');
  const [numero, setNumero] = useState('6681');
  const [rua, setRua] = useState('Av. Ipiranga');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('Porto Alegre');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});

  const validateField = (field: FieldName, value: string) => {
    if (!value.trim()) {
      return 'Este campo é obrigatório.';
    }

    if (field === 'cep' && !/^\d{5}-\d{3}$/.test(value.trim())) {
      return 'Informe um CEP válido.';
    }

    return '';
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<FieldName, string>> = {
      cep: validateField('cep', cep),
      numero: validateField('numero', numero),
      rua: validateField('rua', rua),
      bairro: validateField('bairro', bairro),
      cidade: validateField('cidade', cidade),
    };

    const onlyErrors = Object.fromEntries(
      Object.entries(nextErrors).filter(([, message]) => !!message),
    ) as Partial<Record<FieldName, string>>;

    setFieldErrors(onlyErrors);

    return Object.keys(onlyErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) {
      return;
    }

    // continuar fluxo quando a validação estiver ok
  };

  return (
    <View style={styles.screenContainer}>
      <SafeAreaView style={styles.topSafeArea} edges={['top']}>
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
      </SafeAreaView>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Endereço de Destino</Text>
        <View style={styles.cardContent}>
          <View style={styles.fieldsContainer}>
            <AppTextField
              label="CEP"
              value={cep}
              onChangeText={setCep}
              onBlur={() =>
                setFieldErrors((current) => ({ ...current, cep: validateField('cep', cep) }))
              }
              keyboardType="number-pad"
              placeholder="00000-000"
              maxLength={9}
              error={fieldErrors.cep}
            />

            <AppTextField
              label="Número"
              value={numero}
              onChangeText={setNumero}
              onBlur={() =>
                setFieldErrors((current) => ({
                  ...current,
                  numero: validateField('numero', numero),
                }))
              }
              keyboardType="number-pad"
              placeholder="Número"
              error={fieldErrors.numero}
            />

            <AppTextField
              label="Rua"
              value={rua}
              onChangeText={setRua}
              onBlur={() =>
                setFieldErrors((current) => ({ ...current, rua: validateField('rua', rua) }))
              }
              placeholder="Rua"
              error={fieldErrors.rua}
            />

            <AppTextField
              label="Bairro"
              value={bairro}
              onChangeText={setBairro}
              onBlur={() =>
                setFieldErrors((current) => ({
                  ...current,
                  bairro: validateField('bairro', bairro),
                }))
              }
              placeholder="Bairro"
              error={fieldErrors.bairro}
            />

            <AppTextField
              label="Cidade"
              value={cidade}
              onChangeText={setCidade}
              onBlur={() =>
                setFieldErrors((current) => ({
                  ...current,
                  cidade: validateField('cidade', cidade),
                }))
              }
              placeholder="Cidade"
              error={fieldErrors.cidade}
            />
          </View>

          <View style={styles.footer}>
            <View style={styles.routeStepIndicatorWrapper}>
              <RouteStepIndicator currentStep={3} totalSteps={4} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.accent,
  },
  topSafeArea: {
    backgroundColor: colors.accent,
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
    marginBottom: 30,
  },
  backButtonPressed: {
    opacity: 0.65,
  },
  title: {
    ...typography.header3,
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
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 16,
  },
  fieldsContainer: {
    gap: 10,
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
  },
});
