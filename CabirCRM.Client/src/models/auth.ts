import type { User } from './user';

export type LoginRequest = {
  username: string;
  password: string;
}

export type RegisterRequest = {
  username: string;
  email: string;
  role: 'Admin' | 'Standard';
  password: string;
}

export type UpdateUserRequest  = {
  id: string;
  username?: string;
  email?: string;
  password?: string;
}

export type AuthResponse = {
  token: string;
  refreshToken?: string;
  Expiration?: string;
  user: User
}