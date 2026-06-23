import { apiPost, apiGet, apiPut, apiDelete } from './api';
import type {
  DependentCreateRequest,
  DependentUpdateRequest,
  DependentResponse,
} from '@/types/dependents.types';

// TK28 — mock X-User-Id aposentado; auth agora é via Bearer (api.ts). No-op.
function getUserContextHeaders(): Record<string, string> {
  return {};
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
