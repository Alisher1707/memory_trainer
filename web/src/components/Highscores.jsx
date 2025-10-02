import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const Highscores = ({ onBack }) => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('global')
  const [selectedGame, setSelectedGame] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [globalScores, setGlobalScores] = useState([])
  const [friendsScores, setFriendsScores] = useState([])
  const [loading, setLoading] = useState(false)

  const games = [
    { id: 'all', name: 'Barcha O\'yinlar', icon: '🎮' },
    { id: 'memory-cards', name: 'Xotira Kartalari', icon: '🃏' },
    { id: 'number-sequence', name: 'Raqam Ketma-ketligi', icon: '🔢' },
    { id: 'color-sequence', name: 'Rang Ketma-ketligi', icon: '🌈' }
  ]

  const difficulties = [
    { id: 'all', name: 'Barcha Darajalar' },
    { id: 'easy', name: 'Oson' },
    { id: 'medium', name: 'O\'rta' },
    { id: 'hard', name: 'Qiyin' }
  ]

  useEffect(() => {
    loadScores()
  }, [selectedGame, selectedDifficulty, activeTab])

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
      // Try to fetch from server, fallback to localStorage
      const params = new URLSearchParams()
      if (selectedGame !== 'all') params.append('gameType', selectedGame)
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty)
      params.append('limit', '20')

      const response = await fetch(`/api/scores/global?${params}`)

      if (response.ok) {
        const data = await response.json()
        setGlobalScores(data.scores || [])
      } else {
        // Fallback to mock/local data
        setGlobalScores(getMockGlobalScores())
      }
    } catch (error) {
      // Fallback to mock data when server is not available
      setGlobalScores(getMockGlobalScores())
    }
  }

  const loadFriendsScores = async () => {
    try {
      // For now, use mock data since friends system is not fully implemented
      setFriendsScores(getMockFriendsScores())
    } catch (error) {
      setFriendsScores([])
    }
  }

  const getMockGlobalScores = () => {
    const mockScores = [
      { id: '1', userName: 'Pro Player', gameType: 'memory-cards', difficulty: 'hard', score: 2500, timestamp: '2024-01-15T10:30:00Z' },
      { id: '2', userName: 'Memory Master', gameType: 'number-sequence', difficulty: 'medium', score: 2200, timestamp: '2024-01-14T15:20:00Z' },
      { id: '3', userName: 'Color Expert', gameType: 'color-sequence', difficulty: 'easy', score: 1800, timestamp: '2024-01-13T09:45:00Z' },
      { id: '4', userName: 'Brain Power', gameType: 'memory-cards', difficulty: 'medium', score: 1950, timestamp: '2024-01-12T14:15:00Z' },
      { id: '5', userName: 'Quick Thinker', gameType: 'number-sequence', difficulty: 'hard', score: 2300, timestamp: '2024-01-11T11:00:00Z' }
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
    return [
      { id: '1', userName: 'Dostim Ali', gameType: 'memory-cards', difficulty: 'medium', score: 1600, timestamp: '2024-01-14T12:30:00Z' },
      { id: '2', userName: 'Bekzod', gameType: 'number-sequence', difficulty: 'easy', score: 1200, timestamp: '2024-01-13T16:20:00Z' },
      { id: '3', userName: 'Malika', gameType: 'color-sequence', difficulty: 'hard', score: 2100, timestamp: '2024-01-12T10:45:00Z' }
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

  const currentScores = activeTab === 'global' ? globalScores : friendsScores

  return (
    <div className="highscores-container">
      <div className="highscores-header">
        <button className="back-button" onClick={onBack}>
          ← Orqaga
        </button>
        <h2>🏆 Yuqori Natijalar</h2>
      </div>

      <div className="highscores-tabs">
        <button
          className={`tab-button ${activeTab === 'global' ? 'active' : ''}`}
          onClick={() => setActiveTab('global')}
        >
          🌍 Global
        </button>
        <button
          className={`tab-button ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          👥 Do'stlar
        </button>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>🎮 O'yin:</label>
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
          >
            {games.map(game => (
              <option key={game.id} value={game.id}>
                {game.icon} {game.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>📊 Daraja:</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            {difficulties.map(diff => (
              <option key={diff.id} value={diff.id}>
                {diff.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="scores-content">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Natijalar yuklanmoqda...</p>
          </div>
        ) : currentScores.length === 0 ? (
          <div className="no-scores">
            <h3>📭 Natijalar Topilmadi</h3>
            <p>Hali bu kategoriyada natijalar yo'q. Birinchi bo'ling!</p>
          </div>
        ) : (
          <div className="scores-list">
            {currentScores.map((score, index) => (
              <div key={score.id} className="score-item">
                <div className="rank">
                  {index === 0 && '🥇'}
                  {index === 1 && '🥈'}
                  {index === 2 && '🥉'}
                  {index > 2 && `#${index + 1}`}
                </div>

                <div className="player-info">
                  <span className="player-name">
                    {score.userName}
                    {user && score.userId === user.id && ' (Siz)'}
                  </span>
                  <div className="game-details">
                    <span className="game-type">
                      {getGameIcon(score.gameType)}
                    </span>
                    <span
                      className="difficulty"
                      style={{ color: getDifficultyColor(score.difficulty) }}
                    >
                      {difficulties.find(d => d.id === score.difficulty)?.name || score.difficulty}
                    </span>
                  </div>
                </div>

                <div className="score-info">
                  <span className="score">⭐ {score.score}</span>
                  <span className="date">{formatDate(score.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeTab === 'friends' && (
        <div className="friends-info">
          <h4>👥 Do'stlar Qo'shish</h4>
          <p>Do'stlaringiz bilan raqobatlashing! Do'stlar qo'shish funksiyasi tez orada qo'shiladi.</p>
        </div>
      )}
    </div>
  )
}

export default Highscores