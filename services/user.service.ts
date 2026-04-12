import { apiPost } from './api';
import type { CreateUserRequest, CreateUserResponse } from '@/types/user.types';

export async function createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
  return apiPost<CreateUserRequest, CreateUserResponse>('/users/', data);
}
