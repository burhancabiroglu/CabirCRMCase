import axios from '../api/axios';

import type { AuthResponse, LoginRequest, RegisterRequest } from '../models';

// ----------------------------------------------------------------------

export class AuthClient {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>('/auth/login', data);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<void> {
    await axios.post('/auth/register', data);
  }

  async logout(): Promise<void> {
    await axios.post('/auth/logout');
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>('/auth/refresh-token', {
      refreshToken,
    });
    return response.data;
  }
}