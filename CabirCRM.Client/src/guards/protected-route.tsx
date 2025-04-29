import type { JSX } from 'react';

import { Navigate, useLocation } from 'react-router';

import { useAuth } from '../hooks';

// ----------------------------------------------------------------------

type ProtectedRouteProps = {
  children: JSX.Element;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
}