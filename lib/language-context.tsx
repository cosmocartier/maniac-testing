"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { englishTranslations } from "./translations/english"
import { germanTranslations } from "./translations/german"

type Language = "en" | "de"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string | string[]
}

const translations = {
  en: englishTranslations,
  de: germanTranslations,
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: () => "",
})

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string): string | string[] => {
    const translation = translations[language][key]
    if (Array.isArray(translation)) {
      return translation
    }
    return translation || key
  }

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setLanguage(savedLanguage as Language)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
