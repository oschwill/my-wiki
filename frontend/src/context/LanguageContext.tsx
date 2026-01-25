// context/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchFromApi } from '../utils/fetchData';

export interface Language {
  _id: string;
  label: string; // z.B. Deutsch
  locale: string; // z.B. 'de'
  enabled?: boolean; // optional, falls API das liefert
}

interface LanguageContextProps {
  language: Language | null;
  setLanguage: (lang: Language) => void;
  languages: Language[];
  loading: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [language, setLanguageState] = useState<Language | null>(null);
  const [loading, setLoading] = useState(true);

  // Sprachen vom Backend laden
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetchFromApi('/api/v1/content/getLanguages', 'GET');

        if (response.success && Array.isArray(response.data)) {
          const langs: Language[] = response.data.filter((l: Language) => l.enabled);

          if (langs.length === 0) {
            setLanguages([]);
            setLanguageState(null);
            return;
          }

          setLanguages(langs);

          const stored = localStorage.getItem('language');

          if (stored) {
            const parsed = JSON.parse(stored);
            const validLang = langs.find((l) => l.locale === parsed.locale);

            if (validLang) {
              setLanguageState(validLang);
            } else {
              // Fallback wenn gespeicherte Sprache nicht mehr existiert
              setLanguageState(langs[0]);
              localStorage.setItem('language', JSON.stringify(langs[0]));
            }
          } else {
            // ✅ ERSTER START → DEFAULT SPEICHERN
            setLanguageState(langs[0]);
            localStorage.setItem('language', JSON.stringify(langs[0]));
          }
        }
      } catch (err) {
        console.error('Fehler beim Laden der Sprachen', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', JSON.stringify(lang));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages, loading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
