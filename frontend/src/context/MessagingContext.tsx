import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { fetchFromApi } from '../utils/fetchData';
import { useAuth } from './AuthContext';

interface MessagingContextType {
  unreadMessageCount: number;
  refreshUnreadMessageCount: () => Promise<void>;
  decrementUnreadMessageCount: () => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

interface MessagingProviderProps {
  children: ReactNode;
}

export const MessagingProvider: React.FC<MessagingProviderProps> = ({ children }) => {
  const { user } = useAuth();

  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  const refreshUnreadMessageCount = useCallback(async () => {
    if (!user?.userId) {
      setUnreadMessageCount(0);
      return;
    }

    try {
      const response = await fetchFromApi('/api/v1/messaging/unread-count', 'GET', null);

      if (response?.success) {
        setUnreadMessageCount(response.count);
      }
    } catch (error) {
      console.error('Error loading unread message count:', error);
    }
  }, [user]);

  const decrementUnreadMessageCount = useCallback(() => {
    setUnreadMessageCount((currentCount) => Math.max(0, currentCount - 1));
  }, []);

  useEffect(() => {
    refreshUnreadMessageCount();
  }, [refreshUnreadMessageCount]);

  return (
    <MessagingContext.Provider
      value={{
        unreadMessageCount,
        refreshUnreadMessageCount,
        decrementUnreadMessageCount,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = (): MessagingContextType => {
  const context = useContext(MessagingContext);

  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }

  return context;
};
