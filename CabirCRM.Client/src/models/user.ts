import type { Role } from './role';

export type User = {
  id: string;
  username: string;
  email: string;
  role: Role
  createdAt: string;
  updatedAt: string;
}