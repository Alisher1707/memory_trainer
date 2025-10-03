import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const GameResultModal = ({
  isOpen,
  onClose,
  gameResult,
  onPlayAgain,
  onMainMenu
}) => {
  const { user, isAuthenticated, updateUserStats } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isNewBest, setIsNewBest] = useState(false)

  useEffect(() => {
    if (isOpen && gameResult && user) {
      checkIfNewBest()
      if (isAuthenticated && !submitted) {
        handleAutoSubmit()
      }
    }
  }, [isOpen, gameResult, user, isAuthenticated])

  const checkIfNewBest = () => {
    if (!user || !gameResult) return

    const gameKey = `${gameResult.gameType}_${gameResult.difficulty}`
    const currentBest = user.stats.bestScores[gameKey] || 0
    setIsNewBest(gameResult.score > currentBest)
  }

  const handleAutoSubmit = async () => {
    if (!gameResult || submitted) return

    setIsSubmitting(true)
    try {
      // Update user stats locally
      updateUserStats(
        gameResult.gameType,
        gameResult.score,
        gameResult.difficulty,
        gameResult.timeSpent,
        gameResult.moves
      )

      // Submit to server
      await submitToServer()
      setSubmitted(true)
    } catch (error) {
      console.error('Auto submit failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleManualSubmit = async () => {
    if (submitted || !gameResult) return

    setIsSubmitting(true)
    try {
      await submitToServer()
      setSubmitted(true)
    } catch (error) {
      console.error('Manual submit failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitToServer = async () => {
    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user.id,
          ...gameResult
        })
      })

      if (!response.ok) {
        throw new Error('Server submission failed')
      }

      return await response.json()
    } catch (error) {
      // Store in localStorage for later sync
      const pendingScores = JSON.parse(localStorage.getItem('pendingScores') || '[]')
      pendingScores.push({ userId: user.id, ...gameResult })
      localStorage.setItem('pendingScores', JSON.stringify(pendingScores))
      throw error
    }
  }

  const getScoreRating = (score) => {
    if (score >= 2000) return { text: 'Ajoyib!', emoji: '🔥', color: '#ff6b6b' }
    if (score >= 1500) return { text: 'Yaxshi!', emoji: '🌟', color: '#feca57' }
    if (score >= 1000) return { text: 'Zo\'r!', emoji: '👍', color: '#48dbfb' }
    if (score >= 500) return { text: 'Yaxshi!', emoji: '😊', color: '#1dd1a1' }
    return { text: 'Mashq qiling!', emoji: '💪', color: '#a55eea' }
  }

  const getGameIcon = (gameType) => {
    switch (gameType) {
      case 'memory_card': return '🃏'
      case 'number_sequence': return '🔢'
      case 'color_sequence': return '🌈'
      default: return '🎮'
    }
  }

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'Oson'
      case 'medium': return 'O\'rta'
      case 'hard': return 'Qiyin'
      default: return difficulty
    }
  }

  if (!isOpen || !gameResult) return null

  const rating = getScoreRating(gameResult.score)

  return (
    <div className="modal-overlay">
      <div className="game-result-modal">
        <div className="modal-header">
          <div className="game-info">
            <span className="game-icon">{getGameIcon(gameResult.gameType)}</span>
            <div className="game-details">
              <h3>O'yin Tugadi!</h3>
              <p>{getDifficultyLabel(gameResult.difficulty)} daraja</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="score-section">
          <div className="main-score">
            <div className="score-circle" style={{ borderColor: rating.color }}>
              <span className="score-emoji">{rating.emoji}</span>
              <span className="score-value">{gameResult.score}</span>
              <span className="score-label">Ball</span>
            </div>
          </div>

          <div className="score-rating" style={{ color: rating.color }}>
            <h2>{rating.text}</h2>
          </div>

          {isNewBest && (
            <div className="new-best-badge">
              🏆 Yangi rekord!
            </div>
          )}
        </div>

        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-icon">⏱️</span>
            <span className="stat-label">Vaqt</span>
            <span className="stat-value">
              {Math.floor(gameResult.timeSpent / 60)}:{(gameResult.timeSpent % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div className="stat-item">
            <span className="stat-icon">🎯</span>
            <span className="stat-label">Harakatlar</span>
            <span className="stat-value">{gameResult.moves}</span>
          </div>

          {user && (
            <div className="stat-item">
              <span className="stat-icon">📊</span>
              <span className="stat-label">Eng yaxshi</span>
              <span className="stat-value">
                {user.stats.bestScores[`${gameResult.gameType}_${gameResult.difficulty}`] || 0}
              </span>
            </div>
          )}
        </div>

        {isAuthenticated ? (
          <div className="submission-status">
            {isSubmitting ? (
              <div className="submitting">
                <div className="spinner"></div>
                <span>Natija yuklanmoqda...</span>
              </div>
            ) : submitted ? (
              <div className="submitted">
                <span className="success-icon">✅</span>
                <span>Natija muvaffaqiyatli saqlandi!</span>
              </div>
            ) : (
              <button className="submit-button" onClick={handleManualSubmit}>
                💾 Serverga Saqlash
              </button>
            )}
          </div>
        ) : (
          <div className="auth-prompt">
            <p>🔐 Natijalarni saqlash uchun tizimga kiring</p>
            <small>Mehmon rejimida natijalar saqlanmaydi</small>
          </div>
        )}

        <div className="action-buttons">
          <button className="play-again-button" onClick={onPlayAgain}>
            🔄 Yana O'ynash
          </button>

          <button className="main-menu-button" onClick={onMainMenu}>
            🏠 Bosh Sahifa
          </button>
        </div>

        <div className="motivational-message">
          {gameResult.score >= 1500 ? (
            <p>🎉 Zo'r natija! Siz haqiqiy xotira ustasi ekansiz!</p>
          ) : gameResult.score >= 1000 ? (
            <p>💪 Yaxshi! Biroz ko'proq mashq qiling!</p>
          ) : (
            <p>🚀 Doimiy mashq qilish orqali yaxshiroq natijalar qo'lga kiritishingiz mumkin!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default GameResultModal