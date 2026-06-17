import type { components } from './api.generated';

// Herdando os schemas do OpenAPI
export type DependentResponse = components['schemas']['DependentResponse'];

export type DependentCreateRequest = components['schemas']['DependentCreate'];

export type DependentUpdateRequest = components['schemas']['DependentUpdate'];

// Tipo auxiliar simplificado usado em algumas listagens da UI
export interface Dependent {
  id: string;
  name: string;
}
