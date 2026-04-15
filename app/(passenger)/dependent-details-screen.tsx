import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Icon } from 'react-native-paper';
import * as z from 'zod';

import AppDialog from '@/components/general/app-dialog';
import { PrimaryButton } from '@/components/general/primary-button';
import { AppScreenContainer } from '@/components/general/app-screen-container';
import { SectionHeader } from '@/components/route/section-header';
import { SecondaryOutlinedButton } from '@/components/general/secondary-outlined-button';
import { DependentList } from '@/components/passenger/dependent-list';
import { colors } from '@/styles/colors';
import { typography } from '@/styles/typography';
import { SubtleOutlinedButton } from '@/components/general/subtle-outlined-button';
import {
  useDependents,
  useDependentsMutation,
  calculateDependentsDiff,
} from '@/hooks/use-dependents';
import { ApiError } from '@/services/api';
import type { Dependent } from '@/types/dependents.types';

const dependentSchema = z.object({
  dependents: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, 'O nome é obrigatório'),
    }),
  ),
});

type DependentFormData = z.infer<typeof dependentSchema>;

export default function DependentDetailsScreen() {
  const router = useRouter();
  const [dependentToDelete, setDependentToDelete] = useState<string | null>(null);
  const [initialDependents, setInitialDependents] = useState<Dependent[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const tempIdCounterRef = useRef(0);

  const { data: loadedDependents, isLoading: isDependentsLoading } = useDependents();
  const { applyDiff, isPending: isMutationPending } = useDependentsMutation();

  const {
    handleSubmit,
    formState: { isDirty, errors },
    reset,
    watch,
    setValue,
  } = useForm<DependentFormData>({
    resolver: zodResolver(dependentSchema),
    defaultValues: {
      dependents: [],
    },
  });

  // Load dependents from API on mount
  useEffect(() => {
    if (loadedDependents) {
      // Transform DependentResponse to Dependent format for form
      const formattedDependents: Dependent[] = loadedDependents.map((dep) => ({
        id: dep.id,
        name: dep.name,
      }));
      setInitialDependents(formattedDependents);
      reset({ dependents: formattedDependents });
    }
  }, [loadedDependents, reset]);

  const dependents = watch('dependents');
  const isSubmitting = isMutationPending;

  const onSubmit = async (data: DependentFormData) => {
    setSubmitError(null);

    try {
      // Calculate diff between initial and current state
      const diff = calculateDependentsDiff(initialDependents, data.dependents);

      if (diff.toCreate.length === 0 && diff.toUpdate.length === 0 && diff.toDelete.length === 0) {
        reset(data);
        return;
      }

      const idMap = await applyDiff(diff);

      const updatedDependents = data.dependents.map((dep) => ({
        ...dep,
        id: idMap.has(dep.id) ? idMap.get(dep.id)! : dep.id,
      }));

      setInitialDependents(updatedDependents);
      reset({ dependents: updatedDependents });
    } catch (error) {
      let errorMessage = 'Erro ao salvar dependentes';

      if (error instanceof ApiError) {
        if (error.status === 403) {
          errorMessage = 'Você não tem permissão para realizar esta ação';
        } else if (error.status === 422) {
          errorMessage = error.detail || 'Dados inválidos. Verifique os nomes dos dependentes';
        } else if (error.detail) {
          errorMessage = error.detail;
        }
      }

      setSubmitError(errorMessage);
    }
  };

  const handleCancel = () => {
    setSubmitError(null);
    reset();
  };

  const handleAdd = () => {
    // avoid field/key collisions.
    const tempId = `temp-${Date.now()}-${tempIdCounterRef.current}`;
    tempIdCounterRef.current += 1;

    setValue('dependents', [...dependents, { id: tempId, name: '' }], {
      shouldDirty: true,
    });
  };

  const handleChangeName = (id: string, name: string) => {
    const index = dependents.findIndex((d) => d.id === id);
    if (index !== -1) {
      setValue(`dependents.${index}.name`, name, { shouldDirty: true, shouldValidate: true });
    }
  };

  const handleConfirmDelete = () => {
    if (dependentToDelete) {
      setValue(
        'dependents',
        dependents.filter((d) => d.id !== dependentToDelete),
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );
      setDependentToDelete(null);
    }
  };

  return (
    <AppScreenContainer backgroundColor={colors.accent}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SectionHeader
          title="Dependentes"
          subtitle="Gerencie as pessoas vinculadas à sua conta."
          showBackButton
          onBackPress={() => router.back()}
        />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Meus Dependentes</Text>

          {dependents.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Icon source="account-group" size={32} color={colors.subtleText} />
              <Text style={styles.emptyStateTitle}>Nenhum dependente cadastrado</Text>
              <Text style={styles.emptyStateDescription}>
                Adicione um dependente para gerenciar suas rotas.
              </Text>

              <SubtleOutlinedButton
                label="Adicionar Dependente"
                icon="plus"
                onPress={handleAdd}
                style={styles.emptyStateAddButton}
              />
            </View>
          ) : (
            <DependentList
              dependents={dependents}
              onChangeName={handleChangeName}
              onRemoveRequest={setDependentToDelete}
              onAdd={handleAdd}
              errors={errors.dependents}
            />
          )}
        </View>

        {isDirty && (
          <View style={styles.actionsContainer}>
            <View style={styles.primaryButtonWrapper}>
              <PrimaryButton
                label={isSubmitting ? 'Salvando...' : 'Salvar Mudanças'}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting || isDependentsLoading}
                icon={
                  <Icon
                    source={isSubmitting ? 'loading' : 'check'}
                    size={20}
                    color={colors.primary}
                  />
                }
                style={styles.saveButton}
              />
            </View>

            <SecondaryOutlinedButton
              label="Cancelar"
              onPress={handleCancel}
              disabled={isSubmitting}
            />
          </View>
        )}
      </ScrollView>

      <AppDialog
        visible={!!dependentToDelete}
        title="Tem certeza que quer deletar o dependente?"
        description="Essa ação não poderá ser desfeita."
        onRequestClose={() => setDependentToDelete(null)}
        actions={[
          {
            label: 'Cancelar',
            variant: 'cancel',
            icon: 'close',
            onPress: () => setDependentToDelete(null),
          },
          {
            label: 'Deletar',
            variant: 'destructive',
            icon: 'check',
            onPress: handleConfirmDelete,
          },
        ]}
      />

      <AppDialog
        visible={!!submitError}
        title="Erro ao salvar"
        description={submitError || ''}
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 24,
  },
  card: {
    backgroundColor: colors.light,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  cardTitle: {
    ...typography.bodyBold,
    color: colors.dark,
    textAlign: 'center',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 8,
  },
  emptyStateTitle: {
    ...typography.body,
    color: colors.subtleText,
    textAlign: 'center',
  },
  emptyStateDescription: {
    ...typography.caption,
    color: colors.subtleText,
    textAlign: 'center',
  },
  emptyStateAddButton: {
    marginTop: 16,
    width: '100%',
  },
  actionsContainer: {
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  primaryButtonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  saveButton: {
    alignSelf: 'center',
  },
});
