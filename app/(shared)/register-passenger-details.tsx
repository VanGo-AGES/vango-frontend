import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthHeader } from '@/components/auth/auth-header';
import AppDialog from '@/components/general/app-dialog';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { PrimaryButton } from '@/components/general/primary-button';
import { DependentInputRow } from '@/components/passenger/dependent-input-row';
import { useDependentsMutation } from '@/hooks/use-dependents';
import { ApiError } from '@/services/api';
import type { Dependent } from '@/types/dependents.types';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export default function PassengerDependentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [hasDependents, setHasDependents] = useState<boolean | null>(false);
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [showRequiredDialog, setShowRequiredDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pendingDependentsAfterDelete, setPendingDependentsAfterDelete] = useState<
    Dependent[] | null
  >(null);

  const skipNextDeleteDialog = useRef(false);
  const { createMutation } = useDependentsMutation();

  const hasInvalidDependents =
    hasDependents === true && dependents.some((dep) => dep.name.trim() === '');

  const handleChangeHasDependents = (value: boolean) => {
    setHasDependents(value);

    if (!value) {
      skipNextDeleteDialog.current = true;
      setDependents([]);
      return;
    }

    if (dependents.length === 0) {
      setDependents([{ id: String(Date.now()), name: '' }]);
    }
  };

  const handleChangeDependents = (nextDependents: Dependent[]) => {
    if (skipNextDeleteDialog.current) {
      skipNextDeleteDialog.current = false;
      setDependents(nextDependents);
      return;
    }

    const wasRemovalAttempt = nextDependents.length < dependents.length;

    if (wasRemovalAttempt) {
      setPendingDependentsAfterDelete(nextDependents);
      setShowDeleteDialog(true);
      return;
    }

    setDependents(nextDependents);
  };

  const handleConfirmDeleteDependent = () => {
    if (pendingDependentsAfterDelete) {
      setDependents(pendingDependentsAfterDelete);
    }
    setPendingDependentsAfterDelete(null);
    setShowDeleteDialog(false);
  };

  const handleCancelDeleteDependent = () => {
    setPendingDependentsAfterDelete(null);
    setShowDeleteDialog(false);
  };

  const handleSubmit = async () => {
    if (hasInvalidDependents) {
      setShowRequiredDialog(true);
      return;
    }

    if (hasDependents && dependents.length > 0) {
      setSubmitError(null);
      try {
        for (const dep of dependents) {
          await createMutation.mutateAsync({ name: dep.name.trim() });
        }
      } catch (error) {
        let errorMessage = 'Erro ao cadastrar dependentes';
        if (error instanceof ApiError && error.detail) {
          errorMessage = error.detail;
        }
        setSubmitError(errorMessage);
        return;
      }
    }

    router.push({ pathname: '/register-success', params: { userType: 'passenger' } });
  };

  return (
    <AppScreenContainer backgroundColor={colors.primary} style={styles.container}>
      <AuthHeader title="Cadastro" subtitle="Comece sua jornada na VanGO" showBackButton />

      <View
        style={[
          styles.contentCard,
          {
            marginBottom: -insets.bottom,
            paddingBottom: 32 + insets.bottom,
          },
        ]}
      >
        <View>
          <Text style={styles.sectionTitle}>Você possui dependentes?</Text>
          <Text style={styles.sectionSubtitle}>
            Isso nos ajuda a ajustar recomendações para você
          </Text>

          <View style={styles.dependentsScrollWrapper}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              contentContainerStyle={styles.dependentsScrollContent}
            >
              <DependentInputRow
                dependents={dependents}
                onChangeDependents={handleChangeDependents}
                hasDependents={hasDependents}
                onChangeHasDependents={handleChangeHasDependents}
              />
            </ScrollView>
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <PrimaryButton
            label={createMutation.isPending ? 'Salvando...' : 'Finalizar'}
            variant="secondary"
            onPress={handleSubmit}
            disabled={createMutation.isPending}
            icon={<MaterialIcons name="arrow-forward" size={20} color={colors.light} />}
          />
        </View>
      </View>

      <AppDialog
        visible={showRequiredDialog}
        title="Campo obrigatório"
        description="Preencha o nome de todos os dependentes para continuar."
        onRequestClose={() => setShowRequiredDialog(false)}
        actions={[
          {
            label: 'Ok',
            icon: 'check',
            onPress: () => setShowRequiredDialog(false),
          },
        ]}
      />

      <AppDialog
        visible={showDeleteDialog}
        title="Tem certeza que quer deletar o dependente?"
        description="Essa ação não poderá ser desfeita."
        onRequestClose={handleCancelDeleteDependent}
        actions={[
          {
            label: 'Cancelar',
            icon: 'close',
            variant: 'cancel',
            onPress: handleCancelDeleteDependent,
          },
          {
            label: 'Deletar',
            icon: 'check',
            variant: 'destructive',
            onPress: handleConfirmDeleteDependent,
          },
        ]}
      />

      <AppDialog
        visible={!!submitError}
        title="Erro ao salvar"
        description={submitError ?? ''}
        onRequestClose={() => setSubmitError(null)}
        actions={[
          {
            label: 'Ok',
            icon: 'check',
            onPress: () => setSubmitError(null),
          },
        ]}
      />
    </AppScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  contentCard: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 44,
    paddingTop: 64,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.light,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    marginBottom: 16,
    textAlign: 'center',
    color: colors.dark,
    ...typography.header3,
  },
  sectionSubtitle: {
    marginBottom: 32,
    textAlign: 'center',
    color: colors.text,
    ...typography.body,
  },
  dependentsScrollWrapper: {
    maxHeight: 320,
  },
  dependentsScrollContent: {
    paddingBottom: 8,
  },
  buttonWrapper: {
    alignSelf: 'center',
  },
});
