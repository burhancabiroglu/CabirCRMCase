import type { User } from './user';
import type { Customer } from './customer';

export type PaginationParams = {
  pageNumber?: number;
  pageSize?: number;
  [key: string]: any;
}

export type Pagination<T> = {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  data: T,
  hasPrevious: boolean,
  hasNext: boolean,
}

export const EmptyPaginationUser: Pagination<User[]> = {
  data: [],
  pageNumber: 0,
  totalPages: 0,
  totalCount: 0,
  pageSize: 5,
  hasPrevious: false,
  hasNext: false
}

export const EmptyPaginationCustomer: Pagination<Customer[]> = {
  data: [],
  pageNumber: 0,
  totalPages: 0,
  totalCount: 0,
  pageSize: 5,
  hasPrevious: false,
  hasNext: false
}