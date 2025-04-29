export type User = {
  id: string;
  username: string;
  email: string;
  role: 'Admin' | 'Standard';
  createdAt: string;
  updatedAt: string;
}