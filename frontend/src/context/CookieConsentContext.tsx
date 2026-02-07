// context/CookieConsentContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { CookieConsent, defaultConsent } from '../dataTypes/cookieConsent';

type CookieConsentContextType = {
  consent: CookieConsent | null;
  setConsent: (consent: CookieConsent) => void;
  resetConsent: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const STORAGE_KEY = 'cookie_consent';

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consent, setConsentState] = useState<CookieConsent | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setConsentState(JSON.parse(stored));
    }
  }, []);

  const setConsent = (newConsent: CookieConsent) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConsent));
    setConsentState(newConsent);
  };

  const resetConsent = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConsentState(null);
  };

  return (
    <CookieConsentContext.Provider value={{ consent, setConsent, resetConsent }}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error('useCookieConsent must be used inside CookieConsentProvider');
  }
  return ctx;
};
