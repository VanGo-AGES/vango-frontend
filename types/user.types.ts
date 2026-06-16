import type { components } from './api.generated';

export type UserRole = 'driver' | 'passenger';

export type CreateUserRequest = Omit<components['schemas']['UserCreate'], 'role'> & {
  role: UserRole;
};

export type UserResponse = Omit<
  components['schemas']['UserResponse'],
  'role' | 'cpf' | 'photo_url'
> & {
  role: UserRole;
  cpf: string | null;
  photo_url: string | null;
};

export type UpdateUserRequest = components['schemas']['UserUpdate'];

export type UpdateUserResponse = UserResponse;

export type CreateUserResponse = UserResponse;

export type LoginRequest = components['schemas']['LoginRequest'];

export type LoginResponse = UserResponse;
