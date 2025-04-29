import axios from '../api/axios';

import type { Customer, PaginationParams, CustomerUpdateRequest } from '../models';

// ----------------------------------------------------------------------

export class CustomerClient {
  async getAll({page, pageSize, ...other}: PaginationParams = {}): Promise<Customer[]> {
    const params = { page, pageSize, ...other, };
    const response = await axios.get<Customer[]>('/customers', { params });
    return response.data;
  }

  async getById(id: string): Promise<Customer> {
    const response = await axios.get<Customer>(`/customers/${id}`);
    return response.data;
  }

  async create(data: Omit<Customer, 'id' | 'registrationDate'>): Promise<Customer> {
    const response = await axios.post<Customer>('/customers', data);
    return response.data;
  }

  async update(id: string, data: CustomerUpdateRequest): Promise<void> {
    await axios.put(`/customers/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`/customers/${id}`);
  }
}