import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')
  const [soundEnabled, setSoundEnabled] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('memoryTrainerTheme') || 'light'
    const savedSound = localStorage.getItem('memoryTrainerSound')

    setTheme(savedTheme)
    if (savedSound !== null) {
      setSoundEnabled(savedSound === 'true')
    }

    // Apply theme to body
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme) => {
    if (newTheme === 'dark') {
      document.body.classList.add('dark-mode')
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.body.classList.remove('dark-mode')
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('memoryTrainerTheme', newTheme)
    applyTheme(newTheme)
  }

  const toggleSound = () => {
    const newSound = !soundEnabled
    setSoundEnabled(newSound)
    localStorage.setItem('memoryTrainerSound', newSound.toString())
  }

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    soundEnabled,
    toggleSound
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}