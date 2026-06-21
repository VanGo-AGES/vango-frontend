import { apiGet, apiPost, apiPut, apiUpload, apiDeleteWithBody } from './api';
import type {
  CreateUserRequest,
  CreateUserResponse,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  UpdateUserRequest,
  UpdateUserResponse,
  UserResponse,
} from '@/types/user.types';

export async function createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
  return apiPost<CreateUserRequest, CreateUserResponse>('/users/', data);
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  return apiPost<LoginRequest, LoginResponse>('/auth/login', data);
}

export async function logoutUser(): Promise<void> {
  return apiPost<Record<string, never>, void>('/auth/logout', {});
}

export async function requestPasswordReset(data: ForgotPasswordRequest): Promise<void> {
  return apiPost<ForgotPasswordRequest, void>('/auth/password/forgot', data);
}

export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
  return apiPost<ResetPasswordRequest, void>('/auth/password/reset', data);
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

export async function deleteMyAccount(): Promise<void> {
  await apiDeleteWithBody<{ confirm: true }, void>('/users/me', { confirm: true });
}
