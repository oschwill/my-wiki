import { useEffect, useState } from 'react';

// useIpAddress.ts
export const useIpAddress = (dispatch: React.Dispatch<any>) => {
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        dispatch({ type: 'SET_FIELD', field: 'ipAddress', value: data.ip });
      } catch (err) {
        console.warn('IP-Adresse konnte nicht geladen werden', err);
      }
    };
    fetchIp();
  }, [dispatch]);
};

export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn('SessionStorage read error', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn('SessionStorage write error', error);
    }
  }, [storedValue]);

  return [storedValue, setStoredValue] as const;
}
