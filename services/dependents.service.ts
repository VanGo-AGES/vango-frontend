import { apiPost, apiGet, apiPut, apiDelete } from './api';
import { useSessionStore } from '@/store/session.store';
import type {
  DependentCreateRequest,
  DependentUpdateRequest,
  DependentResponse,
} from '@/types/dependents.types';

function getUserContextHeaders(): Record<string, string> {
  const user = useSessionStore.getState().user;
  return {
    'X-User-Id': user?.id ?? '',
    'X-User-Role': user?.role ?? 'passenger',
  };
}

export async function listDependents(): Promise<DependentResponse[]> {
  return apiGet<DependentResponse[]>('/dependents/', getUserContextHeaders());
}

export async function createDependent(data: DependentCreateRequest): Promise<DependentResponse> {
  return apiPost<DependentCreateRequest, DependentResponse>(
    '/dependents/',
    data,
    getUserContextHeaders(),
  );
}

export async function updateDependent(
  dependentId: string,
  data: DependentUpdateRequest,
): Promise<DependentResponse> {
  return apiPut<DependentUpdateRequest, DependentResponse>(
    `/dependents/${dependentId}`,
    data,
    getUserContextHeaders(),
  );
}

export async function deleteDependent(dependentId: string): Promise<void> {
  return apiDelete<void>(`/dependents/${dependentId}`, getUserContextHeaders());
}
