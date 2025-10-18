import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

const GameResultModal = ({
  isOpen,
  onClose,
  gameResult,
  onPlayAgain,
  onMainMenu,
  onSelectGame
}) => {
  const { user, isAuthenticated, updateUserStats } = useAuth()
  const { t } = useLanguage()
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
    if (score >= 2000) return { text: t('game.excellent'), emoji: '🔥', color: '#ff6b6b' }
    if (score >= 1500) return { text: t('game.great'), emoji: '🌟', color: '#feca57' }
    if (score >= 1000) return { text: t('game.good'), emoji: '👍', color: '#48dbfb' }
    if (score >= 500) return { text: t('game.nice'), emoji: '😊', color: '#1dd1a1' }
    return { text: t('game.keepPracticing'), emoji: '💪', color: '#a55eea' }
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
      case 'easy': return t('games.easy')
      case 'medium': return t('games.medium')
      case 'hard': return t('games.hard')
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
              <h3>{t('game.gameEnded')}</h3>
              <p>{getDifficultyLabel(gameResult.difficulty)} {t('games.level')}</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="score-section">
          <div className="main-score">
            <div className="score-circle">
              <span className="score-emoji">{rating.emoji}</span>
              <span className="score-value">{gameResult.score}</span>
              <span className="score-label">{t('game.score')}</span>
            </div>
          </div>

          <div className="score-rating">
            <h2>{rating.text}</h2>
          </div>

          {isNewBest && (
            <div className="new-best-badge">
              🏆 {t('game.newRecord')}
            </div>
          )}
        </div>

        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-icon">⏱️</span>
            <span className="stat-label">{t('game.time')}</span>
            <span className="stat-value">
              {Math.floor(gameResult.timeSpent / 60)}:{(gameResult.timeSpent % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <div className="stat-item">
            <span className="stat-icon">🎯</span>
            <span className="stat-label">{t('game.actions')}</span>
            <span className="stat-value">{gameResult.moves}</span>
          </div>

          {user && (
            <div className="stat-item">
              <span className="stat-icon">📊</span>
              <span className="stat-label">{t('game.best')}</span>
              <span className="stat-value">
                {user.stats.bestScores[`${gameResult.gameType}_${gameResult.difficulty}`] || 0}
              </span>
            </div>
          )}
        </div>

        <div className="motivational-message">
          {gameResult.score >= 1500 ? (
            <p>🎉 {t('game.motivational1')}</p>
          ) : gameResult.score >= 1000 ? (
            <p>💪 {t('game.motivational2')}</p>
          ) : (
            <p>🚀 {t('game.motivational3')}</p>
          )}
        </div>

        <div className="action-buttons">
          <button className="play-again-button" onClick={onPlayAgain}>
            <span>🔄 {t('game.playAgainButton')}</span>
          </button>

          <button className="select-game-button" onClick={onSelectGame}>
            <span>🎮 {t('game.selectGameButton')}</span>
          </button>

          <button className="main-menu-button" onClick={onMainMenu}>
            <span>🏠 {t('game.mainMenuButton')}</span>
          </button>
        </div>

        {isAuthenticated ? (
          <div className="submission-status">
            {isSubmitting ? (
              <div className="submitting">
                <div className="spinner"></div>
                <span>{t('game.submitting')}</span>
              </div>
            ) : submitted ? (
              <div className="submitted">
                <span className="success-icon">✅</span>
                <span>{t('game.savedSuccessfully')}</span>
              </div>
            ) : (
              <button className="submit-button" onClick={handleManualSubmit}>
                💾 {t('game.saveToServer')}
              </button>
            )}
          </div>
        ) : (
          <div className="auth-prompt">
            <p>🔐 {t('game.loginToSave')}</p>
            <small>{t('game.guestModeWarning')}</small>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameResultModal