import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Login from '../components/Auth/Login'
import Signup from '../components/Auth/Signup'

const ProfilePage = ({ onNavigate }) => {
  const { user, isAuthenticated, logout, isGuest } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <div className="auth-required">
          <div className="auth-card">
            <div className="auth-icon">🔐</div>
            <h2>Kirish Talab Qilinadi</h2>
            <p>Profilingizni ko'rish va statistikalarni saqlash uchun tizimga kiring.</p>

            <div className="auth-actions">
              <Button
                variant="primary"
                size="large"
                onClick={() => {
                  setAuthMode('login')
                  setShowAuthModal(true)
                }}
                icon="🚀"
              >
                Kirish
              </Button>

              <Button
                variant="outline"
                size="large"
                onClick={() => {
                  setAuthMode('signup')
                  setShowAuthModal(true)
                }}
                icon="📝"
              >
                Ro'yxatdan O'tish
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => onNavigate('home')}
              icon="🏠"
            >
              Bosh sahifaga qaytish
            </Button>
          </div>
        </div>

        <Modal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          size="medium"
        >
          {authMode === 'login' ? (
            <Login
              onClose={() => setShowAuthModal(false)}
              onSwitchToSignup={() => setAuthMode('signup')}
            />
          ) : (
            <Signup
              onClose={() => setShowAuthModal(false)}
              onSwitchToLogin={() => setAuthMode('login')}
            />
          )}
        </Modal>
      </div>
    )
  }

  const getAchievementInfo = (achievementId) => {
    const achievements = {
      first_game: { name: 'Birinchi O\'yin', icon: '🎮', description: 'Birinchi o\'yinni o\'ynadingiz!' },
      veteran: { name: 'Faxriy', icon: '🏆', description: '10 ta o\'yin o\'ynadingiz!' },
      high_scorer: { name: 'Yuqori Ball', icon: '⭐', description: '1500+ ball to\'pladingiz!' },
      difficulty_master: { name: 'Qiyinchilik Ustasi', icon: '💪', description: 'Qiyin darajada o\'ynadingiz!' }
    }
    return achievements[achievementId] || { name: achievementId, icon: '🏅', description: 'Maxsus mukofot' }
  }

  const getRecentGamesChart = () => {
    const recentGames = user.stats.recentGames || []
    const last7Days = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toDateString()

      const dayGames = recentGames.filter(game => game.date === dateStr)
      const dayScore = dayGames.reduce((sum, game) => sum + game.score, 0)

      last7Days.push({
        date: dateStr,
        games: dayGames.length,
        totalScore: dayScore,
        avgScore: dayGames.length > 0 ? Math.round(dayScore / dayGames.length) : 0
      })
    }

    return last7Days
  }

  const chartData = getRecentGamesChart()
  const maxScore = Math.max(...chartData.map(d => d.totalScore), 1)

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>👤 Profil</h1>
        <Button
          variant="outline"
          onClick={logout}
          icon="🚪"
        >
          Chiqish
        </Button>
      </div>

      <div className="profile-content">
        <div className="profile-hero">
          <div className="user-info">
            <div className="user-avatar">
              {isGuest ? '👤' : '👨‍💻'}
            </div>
            <div className="user-details">
              <h2>{isGuest ? 'Mehmon' : user.name}</h2>
              {user.email && <p className="user-email">{user.email}</p>}
              <p className="user-joined">
                {isGuest ? 'Mehmon rejimi' : `Qo'shilgan: ${new Date(user.createdAt).toLocaleDateString('uz-UZ')}`}
              </p>
            </div>
          </div>
        </div>

        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-content">
              <h3>O'yinlar Soni</h3>
              <p className="stat-number">{user.stats.gamesPlayed}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3>Jami Ball</h3>
              <p className="stat-number">{user.stats.totalScore.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>O'rtacha Ball</h3>
              <p className="stat-number">
                {user.stats.gamesPlayed > 0 ? Math.round(user.stats.totalScore / user.stats.gamesPlayed) : 0}
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <h3>Yutuqlar</h3>
              <p className="stat-number">{user.stats.achievements?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="best-scores">
          <h3>🏆 Eng Yaxshi Natijalar</h3>
          {Object.keys(user.stats.bestScores || {}).length > 0 ? (
            <div className="scores-grid">
              {Object.entries(user.stats.bestScores || {}).map(([gameKey, score]) => {
                const [gameType, difficulty] = gameKey.split('_')
                const gameNames = {
                  'memory-cards': 'Xotira Kartalari',
                  'number-sequence': 'Raqam Ketma-ketligi',
                  'color-sequence': 'Rang Ketma-ketligi'
                }
                const diffNames = {
                  'easy': 'Oson',
                  'medium': 'O\'rta',
                  'hard': 'Qiyin'
                }

                return (
                  <div key={gameKey} className="score-item">
                    <div className="score-game">
                      <span className="game-icon">
                        {gameType === 'memory-cards' ? '🃏' :
                         gameType === 'number-sequence' ? '🔢' : '🌈'}
                      </span>
                      <div className="game-info">
                        <span className="game-name">{gameNames[gameType] || gameType}</span>
                        <span className="difficulty">({diffNames[difficulty] || difficulty})</span>
                      </div>
                    </div>
                    <span className="score-value">{score}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="no-scores">
              <p>Hali natijalar yo'q. Birinchi o'yiningizdna keyin bu yerda ko'rinadi.</p>
              <Button
                variant="primary"
                onClick={() => onNavigate('game')}
                icon="🎮"
              >
                O'yin O'ynash
              </Button>
            </div>
          )}
        </div>

        <div className="performance-chart">
          <h3>📊 Haftalik Statistika</h3>
          <div className="chart-container">
            <div className="chart-bars">
              {chartData.map((day, index) => (
                <div key={index} className="chart-day">
                  <div
                    className="chart-bar"
                    style={{
                      height: `${Math.max(5, (day.totalScore / maxScore) * 100)}%`,
                      backgroundColor: day.totalScore > 0 ? '#4CAF50' : '#ddd'
                    }}
                    title={`${day.date}: ${day.games} o'yin, ${day.totalScore} ball`}
                  />
                  <span className="chart-label">
                    {new Date(day.date).toLocaleDateString('uz-UZ', { weekday: 'short' })}
                  </span>
                </div>
              ))}
            </div>
            <div className="chart-info">
              <p>So'nggi 7 kunlik faoliyat</p>
            </div>
          </div>
        </div>

        {user.stats.achievements && user.stats.achievements.length > 0 && (
          <div className="achievements">
            <h3>🏅 Yutuqlar</h3>
            <div className="achievements-grid">
              {user.stats.achievements.map((achievementId, index) => {
                const achievement = getAchievementInfo(achievementId)
                return (
                  <div key={index} className="achievement-item">
                    <span className="achievement-icon">{achievement.icon}</span>
                    <div className="achievement-info">
                      <h4>{achievement.name}</h4>
                      <p>{achievement.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="profile-actions">
          <Button
            variant="primary"
            onClick={() => onNavigate('game')}
            icon="🎮"
          >
            O'yin O'ynash
          </Button>

          <Button
            variant="outline"
            onClick={() => onNavigate('leaderboard')}
            icon="🏆"
          >
            Reytinglar
          </Button>

          <Button
            variant="outline"
            onClick={() => onNavigate('settings')}
            icon="⚙️"
          >
            Sozlamalar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage