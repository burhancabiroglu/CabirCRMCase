import type { Role } from './role';
import type { User } from './user';

export type LoginRequest = {
  username: string;
  password: string;
}

export type RegisterRequest = {
  username: string;
  email: string;
  role: Role;
  password: string;
}

export type UpdateUserRequest  = {
  username?: string;
  email?: string;
  role?: Role;
}

export type AuthResponse = {
  token: string;
  refreshToken?: string;
  Expiration?: string;
  user: User
}