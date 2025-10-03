import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { leaderboardAPI } from '../services/api'

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
    { id: 'memory_card', name: 'Xotira Kartalari', icon: '🃏' },
    { id: 'number_sequence', name: 'Raqam Ketma-ketligi', icon: '🔢' },
    { id: 'color_sequence', name: 'Rang Ketma-ketligi', icon: '🌈' }
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
      const gameType = selectedGame !== 'all' ? selectedGame : null
      const difficulty = selectedDifficulty !== 'all' ? selectedDifficulty : null

      const response = await leaderboardAPI.getLeaderboard(gameType, difficulty, 50)

      if (response.success) {
        setGlobalScores(response.leaderboard || [])
      } else {
        setGlobalScores([])
      }
    } catch (error) {
      console.error('Error loading global scores:', error)
      setGlobalScores([])
    }
  }

  const loadFriendsScores = async () => {
    try {
      // Do'stlar tizimi hali to'liq ishlamaydi
      setFriendsScores([])
    } catch (error) {
      setFriendsScores([])
    }
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