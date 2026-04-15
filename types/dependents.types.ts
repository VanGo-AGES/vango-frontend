export interface Dependent {
  id: string;
  name: string;
}

export interface DependentCreateRequest {
  name: string;
}

export interface DependentUpdateRequest {
  name?: string;
}

export interface DependentResponse {
  id: string;
  guardian_id: string;
  name: string;
  created_at: string;
}
