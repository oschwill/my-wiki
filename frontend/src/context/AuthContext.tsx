import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextProps, User } from '../dataTypes/types';
import { fetchFromApi } from '../utils/fetchData';
import { useSessionStorage } from '../hooks/hookHelper';

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  setUser: () => {},
  authToken: null,
  setAuthToken: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useSessionStorage('authToken', null);

  useEffect(() => {
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

    if (authToken) {
      fetchUser();
    } else {
      setUser(null);
      setLoading(false);
    }

    fetchUser();
  }, [authToken]);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, authToken, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); // Hook
