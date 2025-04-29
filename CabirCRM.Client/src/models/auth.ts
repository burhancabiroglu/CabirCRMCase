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
  expiresIn?: number;
  user: {
    id: string;
    username: string;
    role: string;
  };
}