import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Button from '../ui/Button'

const Navbar = ({ currentPage, onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu)
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    onNavigate('home')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => onNavigate('home')}>
          <span className="brand-text">Memory Trainer</span>
        </div>

        <div className="navbar-user">
          {isAuthenticated ? (
            <div className="user-menu">
              <button
                className="user-avatar"
                onClick={handleUserMenuToggle}
              >
                <span className="avatar-icon">👤</span>
                <span className="user-name">{user.name}</span>
                <span className="dropdown-arrow">▼</span>
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <div className="user-details">
                      <span className="user-display-name">{user.name}</span>
                      {user.email && <span className="user-email">{user.email}</span>}
                    </div>
                    <div className="user-stats">
                      <span>🎮 {user.stats.gamesPlayed}</span>
                      <span>⭐ {user.stats.totalScore}</span>
                    </div>
                  </div>

                  <div className="dropdown-divider" />

                  <button
                    className="dropdown-item"
                    onClick={() => {
                      onNavigate('profile')
                      setShowUserMenu(false)
                    }}
                  >
                    <span>👤</span>
                    Profil
                  </button>

                  <button
                    className="dropdown-item"
                    onClick={() => {
                      onNavigate('settings')
                      setShowUserMenu(false)
                    }}
                  >
                    <span>⚙️</span>
                    Sozlamalar
                  </button>

                  <div className="dropdown-divider" />

                  <button
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <span>🚪</span>
                    Chiqish
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Button
                variant="outline"
                size="small"
                onClick={() => onNavigate('auth')}
              >
                Kirish
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar