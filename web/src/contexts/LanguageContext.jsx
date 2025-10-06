import React, { createContext, useContext, useState, useEffect } from 'react'
import uz from '../locales/uz.json'
import en from '../locales/en.json'
import ru from '../locales/ru.json'

const translations = {
  uz,
  en,
  ru
}

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('memoryTrainerLanguage')
    return saved || 'uz'
  })

  useEffect(() => {
    localStorage.setItem('memoryTrainerLanguage', language)
  }, [language])

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang)
    }
  }

  const value = {
    language,
    changeLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageContext
