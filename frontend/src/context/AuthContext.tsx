'use client';
//src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';
import { UserRole } from '@my-app/shared';

type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean; // ✅ NEW
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ✅ NEW

  // Load token & fetch user if token exists
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken);
    } else {
      setLoading(false); // ✅ Done loading if no token
    }
  }, []);

  const fetchUser = async (jwt: string) => {
    try {
      const res = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user', err);
      logout();
    } finally {
      setLoading(false); // ✅ Done either way
    }
  };

  const login = async (jwt: string) => {
    localStorage.setItem('token', jwt);
    setToken(jwt);
    await fetchUser(jwt);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
};
