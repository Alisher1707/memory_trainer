import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const Home = ({ onNavigate }) => {
  const { user, isAuthenticated } = useAuth()

  const games = [
    {
      id: 'memory-cards',
      title: 'Xotira Kartalari',
      description: 'Kartalarni aylantiring va juftlarini toping',
      icon: '🃏',
      difficulty: 'Boshlang\'ich',
      duration: '5-10 daqiqa',
      bgColor: '#ff6b6b'
    },
    {
      id: 'number-sequence',
      title: 'Raqam Ketma-ketligi',
      description: 'Raqamlar ketma-ketligini eslab qoling',
      icon: '🔢',
      difficulty: 'O\'rta',
      duration: '3-7 daqiqa',
      bgColor: '#4ecdc4'
    },
    {
      id: 'color-sequence',
      title: 'Rang Ketma-ketligi',
      description: 'Ranglar tartibini takrorlang',
      icon: '🌈',
      difficulty: 'Murakkab',
      duration: '5-12 daqiqa',
      bgColor: '#ffe66d'
    }
  ]

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="main-title">
          🧠 <span className="gradient-text">Memory Trainer</span>
        </h1>
        <p className="hero-subtitle">
          Miyangizni kuchaytirishning eng qiziqarli yo'li!
        </p>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">3</span>
            <span className="stat-label">O'yin Turi</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">∞</span>
            <span className="stat-label">Darajalar</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">🏆</span>
            <span className="stat-label">Yutuqlar</span>
          </div>
        </div>
      </div>

      {isAuthenticated && (
        <div className="welcome-section">
          <h3>👋 Xush kelibsiz, {user.name}!</h3>
          <div className="quick-stats">
            <span>🎮 {user.stats.gamesPlayed} o'yin</span>
            <span>⭐ {user.stats.totalScore} ball</span>
          </div>
        </div>
      )}

      <div className="games-section">
        <h2>🎮 O'yin Tanlang</h2>
        <div className="games-grid">
          {games.map((game) => (
            <div
              key={game.id}
              className="game-card"
              style={{ '--bg-color': game.bgColor }}
              onClick={() => onNavigate('games')}
            >
              <div className="game-card-header">
                <div className="game-icon">{game.icon}</div>
                <div className="game-difficulty">{game.difficulty}</div>
              </div>

              <div className="game-card-content">
                <h3>{game.title}</h3>
                <p>{game.description}</p>

                <div className="game-card-footer">
                  <span className="duration">⏱️ {game.duration}</span>
                  <button className="play-btn">
                    ▶️ O'ynash
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="action-section">
        <button
          className="main-play-button"
          onClick={() => onNavigate('games')}
        >
          🚀 O'yinni Boshlash
        </button>

        <div className="secondary-buttons">
          <button
            className="nav-button profile-btn"
            onClick={() => onNavigate('profile')}
          >
            <span className="btn-icon">👤</span>
            <span className="btn-text">Profil</span>
          </button>

          <button
            className="nav-button highscores-btn"
            onClick={() => onNavigate('highscores')}
          >
            <span className="btn-icon">🏆</span>
            <span className="btn-text">Reytinglar</span>
          </button>
        </div>
      </div>

      <div className="features-showcase">
        <div className="feature-highlight">
          <div className="feature-icon">🎯</div>
          <h3>3 Daraja Qiyinligi</h3>
          <p>Boshlang'ichdan professionalga qadar</p>
        </div>

        <div className="feature-highlight">
          <div className="feature-icon">📊</div>
          <h3>Statistika va Tahlil</h3>
          <p>O'sishingizni kuzatib boring</p>
        </div>

        <div className="feature-highlight">
          <div className="feature-icon">🌍</div>
          <h3>Global Raqobat</h3>
          <p>Dunyodagi o'yinchilar bilan raqobatlashing</p>
        </div>
      </div>

      <div className="motivation-section">
        <div className="motivation-card">
          <h3>💡 Bilasizmi?</h3>
          <p>Har kuni 10-15 daqiqa xotira mashqlari miyangizni 40% gacha yaxshilaydi!</p>
        </div>
      </div>
    </div>
  )
}

export default Home