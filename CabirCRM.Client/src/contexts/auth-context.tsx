import type { ReactNode} from 'react';
import type { User, AuthResponse, LoginRequest, RegisterRequest, UpdateUserRequest } from 'src/models';

import { useState , useEffect, useCallback, createContext } from 'react';

import { decodeObject, encodeObject } from 'src/utils/crypto-util';

import { AuthClient } from 'src/clients';

// ----------------------------------------------------------------------

type AuthContextType = {
  user?: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  register: (credentials: RegisterRequest) => Promise<void>;
  getUser: () => Promise<User | null>;
  updateProfile: (id: string, data: UpdateUserRequest) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
const authClient = new AuthClient();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
    setIsInitialized(true);
    getAndSetUser().then(() => {});
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response: AuthResponse = await authClient.login(credentials);
    localStorage.setItem('access_token', response.token);
    localStorage.setItem('user_token', await encodeObject(response.user, response.token));
    setUser(response.user);
    setIsAuthenticated(true);
  };

  const register = async (credentials: RegisterRequest) => {
    await authClient.register(credentials);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_token');
    setIsAuthenticated(false);
  };

  const getUser = useCallback(async (): Promise<User | null> => {
    try {
      const encoded = localStorage.getItem('user_token');
      const secret = localStorage.getItem('access_token') ?? '';

      if (!encoded) return null;

      return await decodeObject(encoded, secret);
    } catch {
      return null;
    }
  }, []);

  const getAndSetUser= async (): Promise<void> => {
    setUser(await getUser());
  }

  const updateProfile = async (id: string,data: UpdateUserRequest) => {
    const token = localStorage.getItem('access_token');
    if (!token) throw new Error('No access token');

    await authClient.updateProfile(id, data);
    const newUser = {
      ...user,
      ...data,
    } as User
    console.log(newUser);
    localStorage.setItem('user_token', await encodeObject(newUser, token));
    setUser(newUser);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isInitialized, login, logout, register, user, getUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
