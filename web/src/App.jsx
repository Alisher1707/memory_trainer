import React, { useState, useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Layout components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Pages
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import ProfilePage from './pages/ProfilePage'
import LeaderboardPage from './pages/LeaderboardPage'
import AuthPage from './pages/AuthPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [pageParams, setPageParams] = useState({})

  // Handle navigation with parameters
  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page)
    setPageParams(params)

    // Update URL without page reload (basic routing)
    const url = params && Object.keys(params).length > 0
      ? `#/${page}?${new URLSearchParams(params).toString()}`
      : `#/${page}`

    window.history.replaceState(null, null, url)
  }

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.slice(1)
      const [path, search] = hash.split('?')
      const page = path.slice(1) || 'home'
      const params = search ? Object.fromEntries(new URLSearchParams(search)) : {}

      setCurrentPage(page)
      setPageParams(params)
    }

    window.addEventListener('popstate', handlePopState)

    // Initialize from URL on load
    handlePopState()

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />

      case 'game':
        return (
          <GamePage
            gameType={pageParams.gameType}
            level={pageParams.level}
            onNavigate={handleNavigate}
          />
        )

      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />

      case 'leaderboard':
        return <LeaderboardPage onNavigate={handleNavigate} />

      case 'auth':
        return (
          <AuthPage
            mode={pageParams.mode || 'login'}
            onNavigate={handleNavigate}
          />
        )

      case 'settings':
        return <SettingsPage onNavigate={handleNavigate} />

      default:
        return <HomePage onNavigate={handleNavigate} />
    }
  }

  const shouldShowNavbar = !['game'].includes(currentPage)
  const shouldShowFooter = ['home', 'leaderboard', 'profile'].includes(currentPage)

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="app">
          {shouldShowNavbar && (
            <Navbar
              currentPage={currentPage}
              onNavigate={handleNavigate}
            />
          )}

          <main className={`main-content ${!shouldShowNavbar ? 'full-screen' : ''}`}>
            {renderCurrentPage()}
          </main>

          {shouldShowFooter && <Footer />}

          {/* Global loading states, notifications, etc. could go here */}
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App