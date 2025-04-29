import { useState, useEffect } from 'react';

import { UserClient } from '../clients';

import type { User, PaginationParams } from '../models';

// ----------------------------------------------------------------------

const userClient = new UserClient();

// ----------------------------------------------------------------------

export function useUsers(params?: PaginationParams) {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await userClient.getAll(params);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers().then(r => {});
  }, [params]);

  return { data, loading, error };
}