import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createDependent,
  deleteDependent,
  listDependents,
  updateDependent,
} from '@/services/dependents.service';
import type {
  Dependent,
  DependentCreateRequest,
  DependentUpdateRequest,
} from '@/types/dependents.types';

const DEPENDENTS_QUERY_KEY = ['dependents'];

/**
 * Pure function to calculate diff between initial and current dependent lists.
 * Returns three groups: new items (to create), modified items (to update), and removed items (to delete).
 */
export function calculateDependentsDiff(
  initialDependents: Dependent[],
  currentDependents: Dependent[],
): {
  toCreate: Dependent[];
  toUpdate: Dependent[];
  toDelete: Dependent[];
} {
  const initialMap = new Map(initialDependents.map((d) => [d.id, d]));
  const currentMap = new Map(currentDependents.map((d) => [d.id, d]));

  const toCreate: Dependent[] = [];
  const toUpdate: Dependent[] = [];
  const toDelete: Dependent[] = [];

  for (const [id, current] of currentMap.entries()) {
    const initial = initialMap.get(id);
    if (!initial) {
      toCreate.push(current);
    } else if (initial.name !== current.name) {
      toUpdate.push(current);
    }
  }

  for (const [id, initial] of initialMap.entries()) {
    if (!currentMap.has(id)) {
      toDelete.push(initial);
    }
  }

  return { toCreate, toUpdate, toDelete };
}

/**
 * Hook to fetch list of dependents.
 */
export function useDependents() {
  return useQuery({
    queryKey: DEPENDENTS_QUERY_KEY,
    queryFn: () => listDependents(),
  });
}

/**
 * Hook to perform dependent operations (create, update, delete individually or in batch via diff).
 * Handles individual mutations and invalidates query cache on success.
 */
export function useDependentsMutation() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: DependentCreateRequest) => createDependent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPENDENTS_QUERY_KEY });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: DependentUpdateRequest }) =>
      updateDependent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPENDENTS_QUERY_KEY });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDependent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEPENDENTS_QUERY_KEY });
    },
  });

  /**
   * Apply diff: execute create, update, delete operations in order.
   * Returns mapping of local IDs to real server IDs for newly created dependents.
   * Errors are thrown to be caught by caller for proper error handling.
   */
  const applyDiff = async (diff: {
    toCreate: Dependent[];
    toUpdate: Dependent[];
    toDelete: Dependent[];
  }): Promise<Map<string, string>> => {
    const idMap = new Map<string, string>();

    for (const dep of diff.toCreate) {
      const response = await createMutation.mutateAsync({
        name: dep.name,
      });
      idMap.set(dep.id, response.id);
    }

    for (const dep of diff.toUpdate) {
      await updateMutation.mutateAsync({
        id: dep.id,
        data: { name: dep.name },
      });
    }

    for (const dep of diff.toDelete) {
      await deleteMutation.mutateAsync(dep.id);
    }

    return idMap;
  };

  return {
    applyDiff,
    createMutation,
    updateMutation,
    deleteMutation,
    isPending: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}
