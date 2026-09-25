'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Language, uiTranslations, autoTranslate, getProductUrl, hasStaticTranslation } from '@/lib/i18n';
import type { DatoProduct, DatoVariant } from '@/lib/datocms';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language, activeProduct?: DatoProduct | null, activeVariant?: DatoVariant) => void;
  t: (key: string) => string;
  translate: (item: unknown) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('cs');
  const [dynamicTranslations, setDynamicTranslations] = useState<Record<Language, Record<string, string>>>({
    en: {},
    de: {},
    cs: {}
  });

  const pendingRequests = useRef<Set<string>>(new Set());

  // Load language preference and cached dynamic translations from localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const pathnameParts = window.location.pathname.split('/').filter(Boolean);
        if (pathnameParts.length > 0 && ['cs', 'en', 'de'].includes(pathnameParts[0])) {
          setLangState(pathnameParts[0] as Language);
        } else {
          const savedLang = localStorage.getItem('eshop_language') as Language;
          if (savedLang && (savedLang === 'cs' || savedLang === 'en' || savedLang === 'de')) {
            setLangState(savedLang);
          }
        }

        const savedTranslations = localStorage.getItem('eshop_auto_translations');
        if (savedTranslations) {
          setDynamicTranslations(JSON.parse(savedTranslations));
        }
      }
    } catch (e) {
      console.error('Could not load language or translations', e);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const saveTranslationCache = (newTranslations: Record<Language, Record<string, string>>) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('eshop_auto_translations', JSON.stringify(newTranslations));
      }
    } catch (e) {
      console.error('Could not save translation cache', e);
    }
  };

  const fetchDynamicTranslation = useCallback((text: string, targetLang: Language) => {
    if (!text || targetLang === 'cs') return;
    const reqKey = `${targetLang}:${text}`;
    if (pendingRequests.current.has(reqKey)) return;
    pendingRequests.current.add(reqKey);

    fetch(`/api/translate?text=${encodeURIComponent(text)}&to=${targetLang}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.translatedText && data.translatedText !== text) {
          setDynamicTranslations((prev) => {
            const updated = {
              ...prev,
              [targetLang]: {
                ...(prev[targetLang] || {}),
                [text]: data.translatedText
              }
            };
            saveTranslationCache(updated);
            return updated;
          });
        }
      })
      .catch((err) => console.warn('Dynamic translation fetch failed:', err))
      .finally(() => {
        pendingRequests.current.delete(reqKey);
      });
  }, []);

  const setLang = (newLang: Language, activeProduct?: DatoProduct | null, activeVariant?: DatoVariant) => {
    setLangState(newLang);
    try {
      localStorage.setItem('eshop_language', newLang);
    } catch (e) {
      console.error('Could not save language', e);
    }

    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const parts = currentPath.split('/').filter(Boolean);

      let targetUrl = '/';

      if (activeProduct) {
        targetUrl = getProductUrl(activeProduct, activeVariant, newLang);
      } else {
        let pathParts = [...parts];
        if (pathParts.length > 0 && ['cs', 'en', 'de'].includes(pathParts[0])) {
          pathParts.shift();
        }

        const langPrefix = newLang === 'cs' ? '' : `/${newLang}`;
        if (pathParts.length === 0) {
          targetUrl = langPrefix || '/';
        } else {
          targetUrl = `${langPrefix}/${pathParts.join('/')}`;
        }
      }

      if (window.location.pathname !== targetUrl) {
        window.history.pushState({}, '', targetUrl);
      }
    }
  };

  const t = (key: string): string => {
    const entry = uiTranslations[key];
    if (!entry) return key;
    return entry[lang] || entry.cs || key;
  };

  const translate = useCallback((item: unknown): string => {
    if (!item) return '';

    if (typeof item === 'object' && item !== null) {
      const obj = item as Record<string, unknown>;
      const directVal = obj[lang] || obj.cs || obj.en || obj.de;
      if (typeof directVal === 'string') return directVal;
      if (directVal) return translate(directVal);
      return '';
    }

    const str = String(item).trim();
    if (!str) return '';

    if (lang === 'cs') return str;

    // 1. If term is in curated dictionary, always return static translation directly
    if (hasStaticTranslation(str)) {
      return autoTranslate(str, lang);
    }

    // 2. Check dynamic translations cache
    if (dynamicTranslations[lang] && dynamicTranslations[lang][str]) {
      return dynamicTranslations[lang][str];
    }

    // 3. Fallback to dictionary & token translation
    const dictTranslation = autoTranslate(str, lang);

    // 4. Trigger dynamic API translation in background if not already cached
    if (typeof window !== 'undefined') {
      fetchDynamicTranslation(str, lang);
    }

    return dictTranslation || str;
  }, [lang, dynamicTranslations, fetchDynamicTranslation]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, translate }}>
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
