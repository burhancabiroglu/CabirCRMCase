import type { JSX } from 'react';

import { Navigate } from 'react-router-dom';

import { useAuth } from '../../hooks/use-auth';

// ----------------------------------------------------------------------

type GuestRouteProps = {
  children: JSX.Element;
};

export function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}