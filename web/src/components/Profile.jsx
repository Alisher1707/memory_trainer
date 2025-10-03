import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Login from './Auth/Login'
import Signup from './Auth/Signup'

const Profile = ({ onBack }) => {
  const { user, isAuthenticated, logout, isGuest } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  if (!isAuthenticated) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <button className="back-button" onClick={onBack}>
            ← Orqaga
          </button>
          <h2>👤 Profil</h2>
        </div>

        <div className="auth-prompt">
          <h3>🔐 Kirish Talab Qilinadi</h3>
          <p>Profilingizni ko'rish va statistikalarni saqlash uchun tizimga kiring.</p>
          <button
            className="login-button"
            onClick={() => setShowLogin(true)}
          >
            🚀 Kirish
          </button>
        </div>

        {showLogin && (
          <Login
            onClose={() => setShowLogin(false)}
            onSwitchToSignup={() => {
              setShowLogin(false)
              setShowSignup(true)
            }}
          />
        )}

        {showSignup && (
          <Signup
            onClose={() => setShowSignup(false)}
            onSwitchToLogin={() => {
              setShowSignup(false)
              setShowLogin(true)
            }}
          />
        )}
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
    <div className="profile-container">
      <div className="profile-header">
        <button className="back-button" onClick={onBack}>
          ← Orqaga
        </button>
        <h2>👤 Profil</h2>
        <button className="logout-button" onClick={logout}>
          🚪 Chiqish
        </button>
      </div>

      <div className="profile-content">
        <div className="user-info">
          <h3>
            {isGuest ? '👤 Mehmon' : `👋 ${user.name}`}
          </h3>
          {user.email && <p>📧 {user.email}</p>}
        </div>

        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-info">
              <h4>O'yinlar Soni</h4>
              <p>{user.stats.gamesPlayed}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h4>Jami Ball</h4>
              <p>{user.stats.totalScore}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-info">
              <h4>O'rtacha Ball</h4>
              <p>{user.stats.gamesPlayed > 0 ? Math.round(user.stats.totalScore / user.stats.gamesPlayed) : 0}</p>
            </div>
          </div>
        </div>

        <div className="best-scores">
          <h3>🏆 Eng Yaxshi Natijalar</h3>
          <div className="scores-grid">
            {Object.entries(user.stats.bestScores || {}).map(([gameKey, score]) => {
              const parts = gameKey.split('_')
              const difficulty = parts[parts.length - 1]
              const gameType = parts.slice(0, -1).join('_')
              const gameNames = {
                'memory_card': 'Xotira Kartalari',
                'number_sequence': 'Raqam Ketma-ketligi',
                'color_sequence': 'Rang Ketma-ketligi'
              }
              const diffNames = {
                'easy': 'Oson',
                'medium': 'O\'rta',
                'hard': 'Qiyin'
              }

              return (
                <div key={gameKey} className="score-item">
                  <span className="game-name">{gameNames[gameType] || gameType}</span>
                  <span className="difficulty">({diffNames[difficulty] || difficulty})</span>
                  <span className="score">{score}</span>
                </div>
              )
            })}
          </div>
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

        {user.stats.recentGames && user.stats.recentGames.length > 0 && (
          <div className="recent-games">
            <h3>🕐 O'yin Tarixi</h3>
            <div className="session-header">
              <div className="session-filters">
                <button className="filter-btn active">Barchasi</button>
                <button className="filter-btn">Bu hafta</button>
                <button className="filter-btn">Bu oy</button>
              </div>
            </div>

            <div className="games-list">
              {user.stats.recentGames.slice(0, 15).map((game, index) => {
                const gameNames = {
                  'memory_card': 'Xotira Kartalari',
                  'number_sequence': 'Raqam Ketma-ketligi',
                  'color_sequence': 'Rang Ketma-ketligi'
                }

                const diffNames = {
                  'easy': 'Oson',
                  'medium': 'O\'rta',
                  'hard': 'Qiyin'
                }

                const isHighScore = game.score >= 1500
                const gameDate = new Date(game.timestamp)

                return (
                  <div key={index} className={`game-session-item ${isHighScore ? 'high-score' : ''}`}>
                    <div className="session-rank">
                      #{index + 1}
                    </div>

                    <div className="session-game-info">
                      <div className="game-icon-wrapper">
                        <span className="game-icon">
                          {game.gameType === 'memory_card' ? '🃏' :
                           game.gameType === 'number_sequence' ? '🔢' : '🌈'}
                        </span>
                        {isHighScore && <span className="high-score-badge">🔥</span>}
                      </div>

                      <div className="game-details">
                        <h4>{gameNames[game.gameType] || game.gameType}</h4>
                        <div className="game-meta">
                          <span className="difficulty">{diffNames[game.difficulty]}</span>
                          <span className="separator">•</span>
                          <span className="duration">{Math.floor(game.timeSpent / 60)}:{(game.timeSpent % 60).toString().padStart(2, '0')}</span>
                          <span className="separator">•</span>
                          <span className="moves">{game.moves} harakat</span>
                        </div>
                      </div>
                    </div>

                    <div className="session-score">
                      <span className="score-value">{game.score}</span>
                      <span className="score-label">ball</span>
                    </div>

                    <div className="session-date">
                      <span className="date-value">
                        {gameDate.toLocaleDateString('uz-UZ', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                      <span className="time-value">
                        {gameDate.toLocaleTimeString('uz-UZ', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {user.stats.recentGames.length > 15 && (
              <div className="load-more">
                <button className="load-more-btn">
                  Ko'proq ko'rish ({user.stats.recentGames.length - 15} ta qolgan)
                </button>
              </div>
            )}
          </div>
        )}

        {(!user.stats.recentGames || user.stats.recentGames.length === 0) && (
          <div className="no-games">
            <div className="no-games-icon">🎮</div>
            <h3>Hali o'yinlar yo'q</h3>
            <p>Birinchi o'yiningizdna keyin bu yerda tarix ko'rinadi</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile