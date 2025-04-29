import { useState, useEffect } from 'react';

import { CustomerClient } from '../clients';

import type { Customer, PaginationParams } from '../models';

// ----------------------------------------------------------------------

const customerClient = new CustomerClient();

// ----------------------------------------------------------------------

export function useCustomers(params?: PaginationParams) {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const result = await customerClient.getAll(params);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers().then(r => {});
  }, [params]);

  return { data, loading, error };
}