import { useEffect } from 'react';

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
