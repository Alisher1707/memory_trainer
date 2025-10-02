import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/Button'

const HomePage = ({ onNavigate }) => {
  const { user, isAuthenticated } = useAuth()

  const games = [
    {
      id: 'memory-cards',
      title: 'Xotira Kartalari',
      description: 'Kartalarni aylantiring va juftlarini toping',
      icon: '🃏',
      difficulty: 'Boshlang\'ich',
      duration: '5-10 daqiqa',
      bgColor: '#ff6b6b',
      players: '1.2K+'
    },
    {
      id: 'number-sequence',
      title: 'Raqam Ketma-ketligi',
      description: 'Raqamlar ketma-ketligini eslab qoling',
      icon: '🔢',
      difficulty: 'O\'rta',
      duration: '3-7 daqiqa',
      bgColor: '#4ecdc4',
      players: '890+'
    },
    {
      id: 'color-sequence',
      title: 'Rang Ketma-ketligi',
      description: 'Ranglar tartibini takrorlang',
      icon: '🌈',
      difficulty: 'Murakkab',
      duration: '5-12 daqiqa',
      bgColor: '#ffe66d',
      players: '650+'
    }
  ]

  const handleGameSelect = (gameId) => {
    onNavigate('game', { gameType: gameId })
  }

  return (
    <div className="page-container">
      <div className="hero-section">
        <div className="hero-background">
          <div className="hero-visual-card">
            <div className="visual-card-grid">
              <div className="visual-card-item">
                <div className="card-face"></div>
              </div>
              <div className="visual-card-item">
                <div className="card-face"></div>
              </div>
              <div className="visual-card-item">
                <div className="card-face"></div>
              </div>
              <div className="visual-card-item">
                <div className="card-face"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Memory Trainer</span>
          </h1>
          <p className="hero-subtitle">
            Miyangizni kuchaytirishning eng qiziqarli yo'li
          </p>
          <div className="hero-stats-compact">
            <div className="stat-compact">
              <span className="stat-number-compact">1,000+</span>
              <span className="stat-label-compact">Foydalanuvchi</span>
            </div>
            <div className="stat-compact">
              <span className="stat-number-compact">50,000+</span>
              <span className="stat-label-compact">O'yin o'ynaldi</span>
            </div>
            <div className="stat-compact">
              <span className="stat-number-compact">95%</span>
              <span className="stat-label-compact">Qoniqish darajasi</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-header-main">
        <h2>O'yin Tanlang</h2>
        <p>Har bir o'yin turli ko'nikmalarni rivojlantiradi</p>
      </div>

      {isAuthenticated && user && (
        <div className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-header">
              <h3>Xush kelibsiz, {user.name}!</h3>
              <Button
                variant="ghost"
                size="small"
                onClick={() => onNavigate('profile')}
              >
                Profil
              </Button>
            </div>
            <div className="quick-stats">
              <div className="quick-stat">
                <span className="stat-text">{user.stats.gamesPlayed} o'yin</span>
              </div>
              <div className="quick-stat">
                <span className="stat-text">{user.stats.totalScore} ball</span>
              </div>
              <div className="quick-stat">
                <span className="stat-text">
                  {user.stats.gamesPlayed > 0 ?
                    Math.round(user.stats.totalScore / user.stats.gamesPlayed) : 0} o'rtacha
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="games-section">

        <div className="games-grid">
          {games.map((game) => (
            <div
              key={game.id}
              className="game-card"
              style={{ '--bg-color': game.bgColor }}
              onClick={() => handleGameSelect(game.id)}
            >
              <div className="game-card-header">
                <div className="game-popularity">
                  <span className="players-count">{game.players}</span>
                  <span className="players-label">o'yinchi</span>
                </div>
              </div>

              <div className="game-card-content">
                <h3>{game.title}</h3>
                <p>{game.description}</p>

                <div className="game-card-meta">
                  <div className="meta-item">
                    <span className="meta-text">{game.difficulty}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-text">{game.duration}</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="medium"
                  className="game-play-button"
                >
                  O'ynash
                </Button>
              </div>

              <div className="game-card-overlay" />
            </div>
          ))}
        </div>
      </div>

      <div className="features-section">
        <div className="section-header">
          <h2>Nega Memory Trainer?</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <h3>3 Daraja Qiyinligi</h3>
            <p>Boshlang'ichdan professionalga qadar o'z darajangizni tanlang</p>
          </div>

          <div className="feature-card">
            <h3>Batafsil Statistika</h3>
            <p>O'sishingizni kuzatib boring va grafiklar orqali tahlil qiling</p>
          </div>

          <div className="feature-card">
            <h3>Global Raqobat</h3>
            <p>Dunyodagi o'yinchilar bilan raqobatlashing va reytingda ko'tariling</p>
          </div>

          <div className="feature-card">
            <h3>Yutuqlar Tizimi</h3>
            <p>Maxsus yutuqlarni qo'lga kiriting va rekordlar o'rnating</p>
          </div>

          <div className="feature-card">
            <h3>Har Yerda O'ynang</h3>
            <p>Mobil va desktop qurilmalarda mukammal ishlaydi</p>
          </div>

          <div className="feature-card">
            <h3>Progress Saqlanadi</h3>
            <p>Barcha natijalaringiz va statistikangiz avtomatik saqlanadi</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-card">
          <h2>Hoziroq Boshlang!</h2>
          <p>Xotirangizni rivojlantirish uchun birinchi qadamni qo'ying</p>

          {!isAuthenticated ? (
            <div className="cta-actions">
              <Button
                variant="primary"
                size="large"
                onClick={() => onNavigate('auth')}
              >
                Ro'yxatdan O'tish
              </Button>
              <Button
                variant="outline"
                size="large"
                onClick={() => onNavigate('game')}
              >
                Mehmon Sifatida
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="large"
              onClick={() => onNavigate('game')}
            >
              O'yinni Boshlash
            </Button>
          )}
        </div>
      </div>

      <div className="tips-section">
        <div className="tips-card">
          <h3>Bilasizmi?</h3>
          <div className="tips-content">
            <div className="tip-item">
              <p>Har kuni 10-15 daqiqa xotira mashqlari miyangizni 40% gacha yaxshilaydi!</p>
            </div>
            <div className="tip-item">
              <p>Turli xil o'yinlar miyangizning turli qismlarini faollashtiradi.</p>
            </div>
            <div className="tip-item">
              <p>Doimiy mashq qilish xotira sig'imini sezilarli darajada oshiradi.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage