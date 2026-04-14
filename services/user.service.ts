import { apiPost, apiPut } from './api';
import type {
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
} from '@/types/user.types';

export async function createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
  return apiPost<CreateUserRequest, CreateUserResponse>('/users/', data);
}

export async function updateUser(
  userId: string,
  data: UpdateUserRequest,
): Promise<UpdateUserResponse> {
  return apiPut<UpdateUserRequest, UpdateUserResponse>(`/users/${userId}`, data);
}
