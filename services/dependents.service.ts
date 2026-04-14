import { apiPost, apiGet, apiPut, apiDelete } from './api';
import type {
  DependentCreateRequest,
  DependentUpdateRequest,
  DependentResponse,
} from '@/types/dependents.types';

/**
 * Helper to get user context headers for dependent API calls.
 * X-User-Id is the ID of the guardian (user) creating/managing dependents.
 * TODO: Replace with actual user context from session/auth when login is fully integrated.
 */
function getUserContextHeaders(): Record<string, string> {
  // TODO: Should be useSessionStore().getState().driver?.id when auth is complete
  const userId = 'cf8179f6-d028-4cbd-9bc5-6ccbf1e6a70c';
  const userRole = 'guardian'; // TODO: get from session

  return {
    'X-User-Id': userId,
    'X-User-Role': userRole,
  };
}

export async function listDependents(): Promise<DependentResponse[]> {
  const headers = getUserContextHeaders();
  return apiGet<DependentResponse[]>('dependents/', headers);
}

export async function createDependent(data: DependentCreateRequest): Promise<DependentResponse> {
  const headers = getUserContextHeaders();
  return apiPost<DependentCreateRequest, DependentResponse>('dependents/', data, headers);
}

export async function updateDependent(
  dependentId: string,
  data: DependentUpdateRequest,
): Promise<DependentResponse> {
  const headers = getUserContextHeaders();
  return apiPut<DependentUpdateRequest, DependentResponse>(
    `dependents/${dependentId}`,
    data,
    headers,
  );
}

export async function deleteDependent(dependentId: string): Promise<void> {
  const headers = getUserContextHeaders();
  return apiDelete<void>(`dependents/${dependentId}`, headers);
}
