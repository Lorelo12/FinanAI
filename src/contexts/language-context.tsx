"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, string>;
}

// Simple translation dictionary
const translationsDb: Record<Language, Record<string, string>> = {
  pt: {
    settings: 'Configurações',
    appearance: 'Aparência',
    theme: 'Tema',
    select_theme: 'Selecione o tema de sua preferência.',
    language: 'Idioma',
    select_language: 'Escolha o idioma do aplicativo.',
    // Add other translations here
  },
  en: {
    settings: 'Settings',
    appearance: 'Appearance',
    theme: 'Theme',
    select_theme: 'Select your preferred theme.',
    language: 'Language',
    select_language: 'Choose the application language.',
    // Add other translations here
  },
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');
  const [translations, setTranslations] = useState(translationsDb.pt);

  useEffect(() => {
    // Load saved language from localStorage if available
    const savedLanguage = localStorage.getItem('app-language') as Language;
    if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
      setTranslations(translationsDb[savedLanguage]);
    }
  }, []);

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setTranslations(translationsDb[newLanguage]);
    localStorage.setItem('app-language', newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
