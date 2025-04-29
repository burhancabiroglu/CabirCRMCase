import type { ReactNode} from 'react';

import { useState , useEffect, createContext } from 'react';

import { AuthClient } from '../clients';

import type { AuthResponse, LoginRequest } from '../models';

// ----------------------------------------------------------------------

type AuthContextType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
const authClient = new AuthClient();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
    setIsInitialized(true);
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response: AuthResponse = await authClient.login(credentials);
    localStorage.setItem('access_token', response.token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isInitialized, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
