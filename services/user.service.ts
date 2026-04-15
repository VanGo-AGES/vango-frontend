import { apiGet, apiPost, apiPut, apiUpload } from './api';
import type {
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UserResponse,
} from '@/types/user.types';

export async function createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
  return apiPost<CreateUserRequest, CreateUserResponse>('/users/', data);
}

export async function getUser(id: string): Promise<UserResponse> {
  return apiGet<UserResponse>(`/users/${id}`);
}

export async function updateUser(id: string, data: UpdateUserRequest): Promise<UpdateUserResponse> {
  return apiPut<UpdateUserRequest, UpdateUserResponse>(`/users/${id}`, data);
}

export async function uploadPhoto(uri: string): Promise<string> {
  const filename = uri.split('/').pop() ?? 'photo.jpg';
  const ext = filename.split('.').pop() ?? 'jpg';

  const formData = new FormData();
  formData.append('file', { uri, name: filename, type: `image/${ext}` } as unknown as Blob);

  const data = await apiUpload<{ url: string }>('/uploads/photo', formData);
  return data.url;
}
