import type { User, AuthResponse, LoginRequest, RegisterRequest, UpdateUserRequest } from 'src/models';

import axios from 'src/api/axios';

// ----------------------------------------------------------------------

export class AuthClient {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>('/users/login', data);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<void> {
    await axios.post('/users/register', data);
  }

  async logout(): Promise<void> {
    await axios.post('/users/logout');
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>('/users/refresh-token', {
      refreshToken,
    });
    return response.data;
  }

  async updateProfile(id: string, data: UpdateUserRequest): Promise<User> {
    const response = await axios.put<User>(`/users/${id}`, data);
    return response.data;
  }
}