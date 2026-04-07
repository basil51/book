//src/hooks/useAuth.ts
import { useAuthContext } from '@/context/AuthContext';

export const useAuth = () => {
  const { user, token, login, logout, loading, isAuthenticated } = useAuthContext();
  return { user, token, login, logout, loading, isAuthenticated };
};
