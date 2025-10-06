import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import Button from '../components/ui/Button'

const LeaderboardPage = ({ onNavigate }) => {
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState('global')
  const [selectedGame, setSelectedGame] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(false)
  const [timeFilter, setTimeFilter] = useState('all') // all, week, month

  const games = [
    { id: 'all', name: t('leaderboard.allGames'), icon: '🎮' },
    { id: 'memory-cards', name: t('games.memoryCards'), icon: '🃏' },
    { id: 'number-sequence', name: t('games.numberSequence'), icon: '🔢' },
    { id: 'color-sequence', name: t('games.colorSequence'), icon: '🌈' }
  ]

  const difficulties = [
    { id: 'all', name: t('leaderboard.allDifficulties') },
    { id: 'easy', name: t('games.easy') },
    { id: 'medium', name: t('games.medium') },
    { id: 'hard', name: t('games.hard') }
  ]

  const timeFilters = [
    { id: 'all', name: t('leaderboard.allTime') },
    { id: 'week', name: t('leaderboard.thisWeek') },
    { id: 'month', name: t('leaderboard.thisMonth') }
  ]

  useEffect(() => {
    loadScores()
  }, [selectedGame, selectedDifficulty, activeTab, timeFilter])

  const loadScores = async () => {
    setLoading(true)
    try {
      if (activeTab === 'global') {
        await loadGlobalScores()
      } else {
        await loadFriendsScores()
      }
    } catch (error) {
      console.error('Failed to load scores:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadGlobalScores = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedGame !== 'all') params.append('gameType', selectedGame)
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty)
      params.append('limit', '50')

      const response = await fetch(`/api/scores/global?${params}`)

      if (response.ok) {
        const data = await response.json()
        setScores(data.scores || [])
      } else {
        setScores(getMockScores())
      }
    } catch (error) {
      setScores(getMockScores())
    }
  }

  const loadFriendsScores = async () => {
    // Mock friends scores for now
    setScores(getMockFriendsScores())
  }

  const getMockScores = () => {
    const mockScores = [
      { id: '1', userName: 'ProGamer2024', gameType: 'memory-cards', difficulty: 'hard', score: 2850, timestamp: '2024-01-15T10:30:00Z', country: '🇺🇿' },
      { id: '2', userName: 'MemoryMaster', gameType: 'number-sequence', difficulty: 'medium', score: 2720, timestamp: '2024-01-14T15:20:00Z', country: '🇰🇷' },
      { id: '3', userName: 'BrainPower', gameType: 'color-sequence', difficulty: 'easy', score: 2650, timestamp: '2024-01-13T09:45:00Z', country: '🇺🇸' },
      { id: '4', userName: 'QuickThinker', gameType: 'memory-cards', difficulty: 'medium', score: 2580, timestamp: '2024-01-12T14:15:00Z', country: '🇯🇵' },
      { id: '5', userName: 'PuzzlePro', gameType: 'number-sequence', difficulty: 'hard', score: 2490, timestamp: '2024-01-11T11:00:00Z', country: '🇩🇪' },
      { id: '6', userName: 'ColorExpert', gameType: 'color-sequence', difficulty: 'medium', score: 2420, timestamp: '2024-01-10T16:30:00Z', country: '🇫🇷' },
      { id: '7', userName: 'MindAthlete', gameType: 'memory-cards', difficulty: 'easy', score: 2380, timestamp: '2024-01-09T12:45:00Z', country: '🇬🇧' },
      { id: '8', userName: 'LogicLord', gameType: 'number-sequence', difficulty: 'easy', score: 2350, timestamp: '2024-01-08T18:20:00Z', country: '🇨🇦' },
      { id: '9', userName: 'PatternKing', gameType: 'color-sequence', difficulty: 'hard', score: 2310, timestamp: '2024-01-07T14:55:00Z', country: '🇦🇺' },
      { id: '10', userName: 'FastFingers', gameType: 'memory-cards', difficulty: 'medium', score: 2280, timestamp: '2024-01-06T09:15:00Z', country: '🇮🇳' }
    ]

    let filtered = mockScores
    if (selectedGame !== 'all') {
      filtered = filtered.filter(s => s.gameType === selectedGame)
    }
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(s => s.difficulty === selectedDifficulty)
    }

    return filtered.sort((a, b) => b.score - a.score)
  }

  const getMockFriendsScores = () => {
    const friendNames = {
      uz: ['Dostim Ali', 'Bekzod', 'Malika', 'Jasur', 'Nodira'],
      en: ['Friend John', 'Michael', 'Sarah', 'David', 'Emma'],
      ru: ['Друг Алексей', 'Михаил', 'Анна', 'Дмитрий', 'Ольга']
    }
    const names = friendNames[language] || friendNames['uz']

    return [
      { id: '1', userName: names[0], gameType: 'memory-cards', difficulty: 'medium', score: 1890, timestamp: '2024-01-14T12:30:00Z' },
      { id: '2', userName: names[1], gameType: 'number-sequence', difficulty: 'easy', score: 1650, timestamp: '2024-01-13T16:20:00Z' },
      { id: '3', userName: names[2], gameType: 'color-sequence', difficulty: 'hard', score: 2150, timestamp: '2024-01-12T10:45:00Z' },
      { id: '4', userName: names[3], gameType: 'memory-cards', difficulty: 'easy', score: 1420, timestamp: '2024-01-11T15:30:00Z' },
      { id: '5', userName: names[4], gameType: 'number-sequence', difficulty: 'medium', score: 1780, timestamp: '2024-01-10T11:15:00Z' }
    ]
  }

  const getGameIcon = (gameType) => {
    const game = games.find(g => g.id === gameType)
    return game ? game.icon : '🎮'
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50'
      case 'medium': return '#FF9800'
      case 'hard': return '#F44336'
      default: return '#757575'
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('uz-UZ', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return '🥇'
      case 1: return '🥈'
      case 2: return '🥉'
      default: return `${index + 1}`
    }
  }

  const currentScores = scores

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🏆 {t('leaderboard.title')}</h1>
        <p>{t('leaderboard.subtitle')}</p>
      </div>

      <div className="leaderboard-controls">
        <div className="tabs-section">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'global' ? 'active' : ''}`}
              onClick={() => setActiveTab('global')}
            >
              <span className="tab-icon">🌍</span>
              <span className="tab-text">{t('leaderboard.global')}</span>
            </button>
            <button
              className={`tab ${activeTab === 'friends' ? 'active' : ''}`}
              onClick={() => setActiveTab('friends')}
            >
              <span className="tab-icon">👥</span>
              <span className="tab-text">{t('leaderboard.friends')}</span>
            </button>
          </div>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label>🎮 {t('leaderboard.game')}:</label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="filter-select"
            >
              {games.map(game => (
                <option key={game.id} value={game.id}>
                  {game.icon} {game.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>📊 {t('leaderboard.difficulty')}:</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="filter-select"
            >
              {difficulties.map(diff => (
                <option key={diff.id} value={diff.id}>
                  {diff.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>📅 {t('leaderboard.time')}:</label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="filter-select"
            >
              {timeFilters.map(filter => (
                <option key={filter.id} value={filter.id}>
                  {filter.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="leaderboard-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{t('leaderboard.loading')}</p>
          </div>
        ) : currentScores.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>{t('leaderboard.noResults')}</h3>
            <p>{t('leaderboard.noResultsDesc')}</p>
            <Button
              variant="primary"
              onClick={() => onNavigate('game')}
              icon="🎮"
            >
              {t('profile.playGame')}
            </Button>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {currentScores.length >= 3 && (
              <div className="podium">
                <div className="podium-position second">
                  <div className="podium-player">
                    <div className="player-avatar">🥈</div>
                    <h4>{currentScores[1].userName}</h4>
                    <p className="player-score">{currentScores[1].score.toLocaleString()}</p>
                    <span className="player-country">{currentScores[1].country || '🌍'}</span>
                  </div>
                  <div className="podium-bar second-place"></div>
                </div>

                <div className="podium-position first">
                  <div className="podium-player">
                    <div className="player-avatar champion">🥇</div>
                    <h4>{currentScores[0].userName}</h4>
                    <p className="player-score">{currentScores[0].score.toLocaleString()}</p>
                    <span className="player-country">{currentScores[0].country || '🌍'}</span>
                  </div>
                  <div className="podium-bar first-place"></div>
                </div>

                <div className="podium-position third">
                  <div className="podium-player">
                    <div className="player-avatar">🥉</div>
                    <h4>{currentScores[2].userName}</h4>
                    <p className="player-score">{currentScores[2].score.toLocaleString()}</p>
                    <span className="player-country">{currentScores[2].country || '🌍'}</span>
                  </div>
                  <div className="podium-bar third-place"></div>
                </div>
              </div>
            )}

            {/* Full Rankings List */}
            <div className="rankings-list">
              <div className="rankings-header">
                <h3>📊 {t('leaderboard.fullRanking')}</h3>
                <p>{currentScores.length} {t('leaderboard.results')}</p>
              </div>

              <div className="scores-list">
                {currentScores.map((score, index) => {
                  const isCurrentUser = user && score.userId === user.id

                  return (
                    <div
                      key={score.id}
                      className={`score-item ${isCurrentUser ? 'current-user' : ''} ${index < 3 ? 'top-three' : ''}`}
                    >
                      <div className="rank-section">
                        <span className="rank-number">{getRankIcon(index)}</span>
                      </div>

                      <div className="player-section">
                        <div className="player-info">
                          <span className="player-name">
                            {score.userName}
                            {isCurrentUser && <span className="you-badge">({t('leaderboard.you')})</span>}
                          </span>
                          <div className="player-meta">
                            <span className="game-type">
                              {getGameIcon(score.gameType)}
                            </span>
                            <span
                              className="difficulty"
                              style={{ color: getDifficultyColor(score.difficulty) }}
                            >
                              {difficulties.find(d => d.id === score.difficulty)?.name || score.difficulty}
                            </span>
                            <span className="timestamp">{formatDate(score.timestamp)}</span>
                          </div>
                        </div>
                        {score.country && (
                          <span className="player-country">{score.country}</span>
                        )}
                      </div>

                      <div className="score-section">
                        <span className="score-value">{score.score.toLocaleString()}</span>
                        <span className="score-label">{t('leaderboard.score')}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {activeTab === 'friends' && (
        <div className="friends-section">
          <div className="friends-info">
            <h3>👥 {t('leaderboard.addFriends')}</h3>
            <p>{t('leaderboard.addFriendsDesc')}</p>
            <Button
              variant="outline"
              size="small"
              icon="👥"
              disabled
            >
              {t('leaderboard.addFriend')}
            </Button>
          </div>
        </div>
      )}

      <div className="leaderboard-actions">
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
          onClick={() => loadScores()}
          icon="🔄"
        >
          {t('leaderboard.refresh')}
        </Button>
      </div>
    </div>
  )
}

export default LeaderboardPage