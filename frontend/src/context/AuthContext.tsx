import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextProps, User } from '../dataTypes/types';
import { fetchFromApi } from '../utils/fetchData';
import { useSessionStorage } from '../hooks/hookHelper';

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  setUser: () => {},
  authToken: null,
  setAuthToken: () => null,
  refreshUser: async () => Promise.resolve(),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useSessionStorage<string | null>('authToken', null);

  const fetchUser = async () => {
    try {
      const headers: Record<string, string> = {};

      if (authToken && authToken !== 'cookie') {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const currentUser = await fetchFromApi('/api/v1/user/check-auth', 'POST', null, headers);

      if (!authToken && currentUser) {
        setAuthToken('cookie');
      }

      setUser(currentUser);
    } catch (error) {
      setUser(null);
      if (authToken === 'cookie') {
        setAuthToken(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [authToken]);

  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        authToken,
        setAuthToken,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
