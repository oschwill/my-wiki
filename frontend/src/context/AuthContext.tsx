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
      // Hole den aktuellen User von der API
      const currentUser = await fetchFromApi('/api/v1/user/check-auth', 'POST', null);
      setUser(currentUser);
    } catch (error) {
      setUser(null);
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
    <AuthContext.Provider value={{ user, loading, setUser, authToken, setAuthToken, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); // Hook
