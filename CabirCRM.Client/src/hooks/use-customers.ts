import { useState, useEffect, useCallback } from 'react';

import { CustomerClient } from '../clients';
import {
  EmptyPaginationCustomer,
} from '../models';

import type {
  Customer,
  Pagination,
  PaginationParams,
  CustomerUpdateRequest} from '../models';

// ----------------------------------------------------------------------

const customerClient = new CustomerClient();

// ----------------------------------------------------------------------

export function useCustomers(params?: PaginationParams) {
  const [data, setData] = useState<Pagination<Customer[]>>(EmptyPaginationCustomer);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await customerClient.getAll(params);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  }, [params]);

  const updateCustomer = async (id: string, request: CustomerUpdateRequest) => {
    await customerClient.update(id, request);
    await fetchCustomers();
  };

  useEffect(() => {
    fetchCustomers().then(r => {});
  }, [fetchCustomers]);

  const createCustomer = async (customer: Omit<Customer, 'id' | 'registrationDate'>) => {
    await customerClient.create(customer);
    await fetchCustomers();
  };

  const deleteCustomer = async (id: string) => {
    await customerClient.delete(id);
    await fetchCustomers();
  };

  return { data, loading, error, createCustomer, updateCustomer, deleteCustomer, fetchCustomers };
}