import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import Button from '../components/ui/Button'

const HomePage = ({ onNavigate }) => {
  const { user, isAuthenticated } = useAuth()
  const { t } = useLanguage()

  const games = [
    {
      id: 'memory-cards',
      title: t('home.memoryCardsTitle'),
      description: t('home.memoryCardsDesc'),
      icon: '🃏',
      difficulty: t('home.beginner'),
      duration: t('home.duration1'),
      bgColor: '#ff6b6b',
      players: '1.2K+'
    },
    {
      id: 'number-sequence',
      title: t('home.numberSequenceTitle'),
      description: t('home.numberSequenceDesc'),
      icon: '🔢',
      difficulty: t('home.intermediate'),
      duration: t('home.duration2'),
      bgColor: '#4ecdc4',
      players: '890+'
    },
    {
      id: 'color-sequence',
      title: t('home.colorSequenceTitle'),
      description: t('home.colorSequenceDesc'),
      icon: '🌈',
      difficulty: t('home.advanced'),
      duration: t('home.duration3'),
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
          <div className="hero-pattern">
            <div className="pattern-circle pattern-1"></div>
            <div className="pattern-circle pattern-2"></div>
            <div className="pattern-circle pattern-3"></div>
            <div className="pattern-dots"></div>
          </div>
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Memory Trainer</span>
          </h1>
          <p className="hero-subtitle">
            {t('home.subtitle')}
          </p>
          <div className="hero-stats-compact">
            <div className="stat-compact">
              <span className="stat-number-compact">1,000+</span>
              <span className="stat-label-compact">{t('home.users')}</span>
            </div>
            <div className="stat-compact">
              <span className="stat-number-compact">50,000+</span>
              <span className="stat-label-compact">{t('home.gamesPlayed')}</span>
            </div>
            <div className="stat-compact">
              <span className="stat-number-compact">95%</span>
              <span className="stat-label-compact">{t('home.satisfaction')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-header-main">
        <h2>{t('home.selectGame')}</h2>
        <p>{t('home.selectGameDesc')}</p>
      </div>

      {isAuthenticated && user && (
        <div className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-header">
              <h3>{t('home.welcome')}, {user.name}!</h3>
              <Button
                variant="ghost"
                size="small"
                onClick={() => onNavigate('profile')}
              >
                {t('home.profile')}
              </Button>
            </div>
            <div className="quick-stats">
              <div className="quick-stat">
                <span className="stat-text">{user.stats.gamesPlayed} {t('home.games')}</span>
              </div>
              <div className="quick-stat">
                <span className="stat-text">{user.stats.totalScore} {t('home.score')}</span>
              </div>
              <div className="quick-stat">
                <span className="stat-text">
                  {user.stats.gamesPlayed > 0 ?
                    Math.round(user.stats.totalScore / user.stats.gamesPlayed) : 0} {t('home.avgScore')}
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
                  <span className="players-label">{t('home.players')}</span>
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
                  {t('home.play')}
                </Button>
              </div>

              <div className="game-card-overlay" />
            </div>
          ))}
        </div>
      </div>

      <div className="features-section">
        <div className="section-header">
          <h2>{t('home.whyMemoryTrainer')}</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <h3>{t('home.feature1Title')}</h3>
            <p>{t('home.feature1Desc')}</p>
          </div>

          <div className="feature-card">
            <h3>{t('home.feature2Title')}</h3>
            <p>{t('home.feature2Desc')}</p>
          </div>

          <div className="feature-card">
            <h3>{t('home.feature3Title')}</h3>
            <p>{t('home.feature3Desc')}</p>
          </div>

          <div className="feature-card">
            <h3>{t('home.feature4Title')}</h3>
            <p>{t('home.feature4Desc')}</p>
          </div>

          <div className="feature-card">
            <h3>{t('home.feature5Title')}</h3>
            <p>{t('home.feature5Desc')}</p>
          </div>

          <div className="feature-card">
            <h3>{t('home.feature6Title')}</h3>
            <p>{t('home.feature6Desc')}</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-card">
          <h2>{t('home.ctaTitle')}</h2>
          <p>{t('home.ctaDesc')}</p>

          {!isAuthenticated ? (
            <div className="cta-actions">
              <Button
                variant="primary"
                size="large"
                onClick={() => onNavigate('auth')}
              >
                {t('auth.signup')}
              </Button>
              <Button
                variant="outline"
                size="large"
                onClick={() => onNavigate('game')}
              >
                {t('auth.playAsGuest')}
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="large"
              onClick={() => onNavigate('game')}
            >
              {t('home.startGame')}
            </Button>
          )}
        </div>
      </div>

      <div className="tips-section">
        <div className="tips-card">
          <h3>{t('home.didYouKnow')}</h3>
          <div className="tips-content">
            <div className="tip-item">
              <p>{t('home.tip1')}</p>
            </div>
            <div className="tip-item">
              <p>{t('home.tip2')}</p>
            </div>
            <div className="tip-item">
              <p>{t('home.tip3')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage