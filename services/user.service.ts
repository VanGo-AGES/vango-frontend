import { apiGet, apiPost, apiPut, ApiError } from './api';
import type {
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from '@/types/user.types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
  return apiPost<CreateUserRequest, CreateUserResponse>('/users/', data);
}

export async function getUser(id: string): Promise<CreateUserResponse> {
  return apiGet<CreateUserResponse>(`/users/${id}`);
}

export async function updateUser(id: string, data: UpdateUserRequest): Promise<UpdateUserResponse> {
  return apiPut<UpdateUserRequest, UpdateUserResponse>(`/users/${id}`, data);
}

export async function uploadPhoto(uri: string): Promise<string> {
  const filename = uri.split('/').pop() ?? 'photo.jpg';
  const ext = filename.split('.').pop() ?? 'jpg';

  const formData = new FormData();
  formData.append('file', { uri, name: filename, type: `image/${ext}` } as unknown as Blob);

  const response = await fetch(`${BASE_URL}/uploads/photo`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Erro inesperado' }));
    throw new ApiError(response.status, error.detail ?? 'Erro inesperado');
  }

  const data = await response.json();
  return data.url as string;
}
