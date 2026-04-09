import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthHeader } from '@/components/ui/auth-header';
import AppDialog from '@/components/app-dialog';
import { PrimaryButton } from '@/components/primary-button';
import { DependentInputRow, Dependent } from '@/components/dependent-input-row';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';

export default function PassengerDependentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [hasDependents, setHasDependents] = useState<boolean | null>(null);
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [showRequiredDialog, setShowRequiredDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingDependentsAfterDelete, setPendingDependentsAfterDelete] = useState<
    Dependent[] | null
  >(null);

  const skipNextDeleteDialog = useRef(false);

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

  const hasInvalidDependents =
    hasDependents === true && dependents.some((dep) => dep.name.trim() === '');

  const getDialogMessage = () => {
    if (hasDependents === null) {
      return 'Selecione "Sim" ou "Não" para continuar.';
    }

    if (hasInvalidDependents) {
      return 'Preencha o nome de todos os dependentes para continuar.';
    }

    return '';
  };

  const handleSubmit = () => {
    if (hasDependents === null) {
      setShowRequiredDialog(true);
      return;
    }

    if (hasInvalidDependents) {
      setShowRequiredDialog(true);
      return;
    }

    router.push('/exemplo');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader title="Cadastro" subtitle="Comece sua jornada na VanGO" showBackButton />

      <View
        style={[
          styles.content_card,
          {
            marginBottom: -insets.bottom,
            paddingBottom: 32 + insets.bottom,
          },
        ]}
      >
        <View>
          <Text style={styles.section_title}>Você possui dependentes?</Text>
          <Text style={styles.section_subtitle}>
            Isso nos ajuda a ajustar recomendações para você
          </Text>

          <DependentInputRow
            dependents={dependents}
            onChangeDependents={handleChangeDependents}
            hasDependents={hasDependents}
            onChangeHasDependents={handleChangeHasDependents}
          />
        </View>

        <View style={styles.button_wrapper}>
          <PrimaryButton
            label="Finalizar"
            variant="secondary"
            onPress={handleSubmit}
            icon={<MaterialIcons name="arrow-forward" size={20} color={colors.light} />}
          />
        </View>
      </View>

      <AppDialog
        visible={showRequiredDialog}
        title="Campo obrigatório"
        description={getDialogMessage()}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },

  content_card: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 44,
    paddingTop: 64,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.light,
    justifyContent: 'space-between',
  },

  section_title: {
    marginBottom: 16,
    textAlign: 'center',
    color: colors.dark,
    ...typography.header3,
  },

  section_subtitle: {
    marginBottom: 32,
    textAlign: 'center',
    color: colors.text,
    ...typography.body,
  },

  button_wrapper: {
    alignSelf: 'center',
  },
});
