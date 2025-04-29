import type { JSX } from 'react';

import { Navigate } from 'react-router-dom';

import { useAuth } from '../../hooks';

// ----------------------------------------------------------------------

type GuestRouteProps = {
  children: JSX.Element;
};

export function GuestRoute({ children }: GuestRouteProps) {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}