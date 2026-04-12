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

export interface CreateUserResponse {
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
