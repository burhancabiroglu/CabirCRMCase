import axios from '../api/axios';

import type { User } from '../models/user';
import type { UpdateUserRequest } from '../models/auth';

// ----------------------------------------------------------------------

export class UserClient {
  async getAll(): Promise<User[]> {
    const response = await axios.get<User[]>('/users');
    return response.data;
  }

  async getById(id: string): Promise<User> {
    const response = await axios.get<User>(`/users/${id}`);
    return response.data;
  }

  async update(id: string, data: UpdateUserRequest): Promise<void> {
    await axios.put(`/users/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`/users/${id}`);
  }
}