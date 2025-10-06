import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Login from '../components/Auth/Login'
import Signup from '../components/Auth/Signup'

const ProfilePage = ({ onNavigate }) => {
  const { user, isAuthenticated, logout, isGuest } = useAuth()
  const { t, language } = useLanguage()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <div className="auth-required">
          <div className="auth-card">
            <div className="auth-icon">🔐</div>
            <h2>{t('profile.loginRequired')}</h2>
            <p>{t('profile.loginRequiredDesc')}</p>

            <div className="auth-actions">
              <Button
                variant="primary"
                size="small"
                onClick={() => {
                  setAuthMode('login')
                  setShowAuthModal(true)
                }}
                icon="🚀"
              >
                {t('auth.login')}
              </Button>

              <Button
                variant="outline"
                size="small"
                onClick={() => {
                  setAuthMode('signup')
                  setShowAuthModal(true)
                }}
                icon="📝"
              >
                {t('auth.signup')}
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => onNavigate('home')}
              icon="🏠"
            >
              {t('profile.backToHome')}
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
      first_game: { name: t('profile.firstGame'), icon: '🎮', description: t('profile.firstGameDesc') },
      veteran: { name: t('profile.veteran'), icon: '🏆', description: t('profile.veteranDesc') },
      high_scorer: { name: t('profile.highScorer'), icon: '⭐', description: t('profile.highScorerDesc') },
      difficulty_master: { name: t('profile.difficultyMaster'), icon: '💪', description: t('profile.difficultyMasterDesc') }
    }
    return achievements[achievementId] || { name: achievementId, icon: '🏅', description: t('profile.specialReward') }
  }

  const getRecentGamesChart = () => {
    const recentGames = user.stats.recentGames || []
    const last7Days = []
    const today = new Date()

    // Hozirgi haftaning Dushanba sanasini topish
    const currentDay = today.getDay() // 0 = Yakshanba, 1 = Dushanba, ...
    const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1 // Dushanba dan bugunga qadar kunlar

    const monday = new Date(today)
    monday.setDate(today.getDate() - daysFromMonday)
    monday.setHours(0, 0, 0, 0)

    // Dushanba dan boshlab 7 kun
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
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

  const getWeekdayName = (date) => {
    let dayIndex = new Date(date).getDay()
    // Haftani Dushanba dan boshlash uchun: 0 (Yakshanba) -> 6, 1 (Dushanba) -> 0
    dayIndex = dayIndex === 0 ? 6 : dayIndex - 1

    const weekdaysMonFirst = {
      uz: ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'],
      en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    }
    return weekdaysMonFirst[language]?.[dayIndex] || weekdaysMonFirst['en'][dayIndex]
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>👤 {t('profile.title')}</h1>
        <Button
          variant="outline"
          size="small"
          onClick={logout}
          icon="🚪"
        >
          {t('profile.logout')}
        </Button>
      </div>

      <div className="profile-content">
        <div className="profile-hero">
          <div className="user-info">
            <div className="user-avatar">
              {isGuest ? '👤' : '👨‍💻'}
            </div>
            <div className="user-details">
              <h2 className={isGuest ? 'guest-name' : ''}>{isGuest ? t('profile.guest') : user.name}</h2>
              {user.email && <p className="user-email">{user.email}</p>}
              <p className={`user-joined ${isGuest ? 'guest-mode' : ''}`}>
                {isGuest ? t('profile.guestMode') : `${t('profile.joined')}: ${new Date(user.createdAt).toLocaleDateString()}`}
              </p>
            </div>
          </div>
        </div>

        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-content">
              <h3>{t('profile.gamesCount')}</h3>
              <p className="stat-number">{user.stats.gamesPlayed}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3>{t('profile.totalScore')}</h3>
              <p className="stat-number">{user.stats.totalScore.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>{t('profile.avgScore')}</h3>
              <p className="stat-number">
                {user.stats.gamesPlayed > 0 ? Math.round(user.stats.totalScore / user.stats.gamesPlayed) : 0}
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <h3>{t('profile.achievementsCount')}</h3>
              <p className="stat-number">{user.stats.achievements?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="best-scores">
          <h3>🏆 {t('profile.bestResults')}</h3>
          {Object.keys(user.stats.bestScores || {}).length > 0 ? (
            <div className="scores-grid">
              {Object.entries(user.stats.bestScores || {}).map(([gameKey, score]) => {
                const [gameType, difficulty] = gameKey.split('_')
                const gameNames = {
                  'memory-cards': t('games.memoryCards'),
                  'number-sequence': t('games.numberSequence'),
                  'color-sequence': t('games.colorSequence')
                }
                const diffNames = {
                  'easy': t('games.easy'),
                  'medium': t('games.medium'),
                  'hard': t('games.hard')
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
              <p>{t('profile.noResults')}</p>
              <Button
                variant="primary"
                size="small"
                onClick={() => onNavigate('game')}
                icon="🎮"
              >
                {t('profile.playGame')}
              </Button>
            </div>
          )}
        </div>

        <div className="performance-chart">
          <h3>📊 {t('profile.weeklyStats')}</h3>
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
                    {getWeekdayName(day.date)}
                  </span>
                </div>
              ))}
            </div>
            <div className="chart-info">
              <p>{t('profile.last7Days')}</p>
            </div>
          </div>
        </div>

        {user.stats.achievements && user.stats.achievements.length > 0 && (
          <div className="achievements">
            <h3>🏅 {t('profile.achievementsTitle')}</h3>
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
            size="small"
            onClick={() => onNavigate('game')}
            icon="🎮"
          >
            {t('profile.playGame')}
          </Button>

          <Button
            variant="outline"
            size="small"
            onClick={() => onNavigate('leaderboard')}
            icon="🏆"
          >
            {t('profile.ratings')}
          </Button>

          <Button
            variant="outline"
            size="small"
            onClick={() => onNavigate('settings')}
            icon="⚙️"
          >
            {t('nav.settings')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage