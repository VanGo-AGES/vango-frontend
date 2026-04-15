export type UserRole = 'driver' | 'passenger';

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  cpf?: string;
  photo_url?: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  cpf: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  cpf?: string;
  password?: string;
  photo_url?: string;
}

export type UpdateUserResponse = UserResponse;

export type CreateUserResponse = UserResponse;
