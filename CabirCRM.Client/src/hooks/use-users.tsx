import { useState, useEffect } from 'react';

import { UserClient } from '../clients';
import { EmptyPaginationUser } from '../models';

import type { User, Pagination, PaginationParams} from '../models';

// ----------------------------------------------------------------------

const userClient = new UserClient();

// ----------------------------------------------------------------------

export function useUsers(params?: PaginationParams) {
  const [data, setData] = useState<Pagination<User[]>>(EmptyPaginationUser);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

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

  useEffect(() => {
    fetchUsers().then(() => {});
  }, [params]);

  const deleteUser = async (id: string) => {
    await userClient.delete(id);
    await fetchUsers();
    setDeleteSuccess(true);
  };

  return { data, loading, error, fetchUsers, deleteUser, deleteSuccess, setDeleteSuccess };
}