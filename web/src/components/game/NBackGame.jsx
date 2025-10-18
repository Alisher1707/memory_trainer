import React, { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

const NBackGame = ({
  difficulty = 'easy',
  onGameEnd,
  gameState = 'playing',
  lives,
  setLives,
  moves,
  setMoves,
  score,
  setScore,
  onQuit
}) => {
  const { t } = useLanguage()

  // N-Back settings based on difficulty
  const getSettings = () => {
    switch(difficulty) {
      case 'easy':
        return { nBack: 1, speed: 2500, items: ['1', '2', '3', '4', '5'], sequenceLength: 20 }
      case 'medium':
        return { nBack: 2, speed: 2000, items: ['A', 'B', 'C', 'D', 'E', 'F'], sequenceLength: 25 }
      case 'hard':
        return { nBack: 3, speed: 1500, items: ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '⚫'], sequenceLength: 30 }
      default:
        return { nBack: 1, speed: 2500, items: ['1', '2', '3', '4', '5'], sequenceLength: 20 }
    }
  }

  const settings = getSettings()
  const [sequence, setSequence] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [userResponses, setUserResponses] = useState([])
  const [showingItem, setShowingItem] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  // Generate sequence on mount
  useEffect(() => {
    generateSequence()
  }, [])

  const generateSequence = () => {
    const newSequence = []
    for (let i = 0; i < settings.sequenceLength; i++) {
      const randomIndex = Math.floor(Math.random() * settings.items.length)
      newSequence.push(settings.items[randomIndex])
    }
    setSequence(newSequence)
  }

  // Auto-play sequence
  useEffect(() => {
    if (!gameStarted || currentIndex >= sequence.length) return

    const timer = setTimeout(() => {
      if (currentIndex < sequence.length - 1) {
        // Show next item
        setCurrentItem(sequence[currentIndex + 1])
        setShowingItem(true)
        setCurrentIndex(currentIndex + 1)

        // Hide item after display
        setTimeout(() => {
          setShowingItem(false)
          setCurrentItem(null)
        }, settings.speed - 500)
      } else {
        // End game
        endGame()
      }
    }, settings.speed)

    return () => clearTimeout(timer)
  }, [currentIndex, gameStarted, sequence])

  const startGame = () => {
    setGameStarted(true)
    setCurrentIndex(-1)
    setTimeout(() => {
      setCurrentIndex(0)
      setCurrentItem(sequence[0])
      setShowingItem(true)
      setTimeout(() => {
        setShowingItem(false)
        setCurrentItem(null)
      }, settings.speed - 500)
    }, 1000)
  }

  const handleResponse = (isMatch) => {
    console.log('handleResponse called:', { gameStarted, currentIndex, nBack: settings.nBack, showingItem })

    if (!gameStarted || currentIndex < settings.nBack || showingItem) {
      console.log('Response blocked')
      return
    }

    const actualIndex = currentIndex - settings.nBack
    const actualMatch = sequence[currentIndex] === sequence[actualIndex]
    const correct = isMatch === actualMatch

    console.log('Response details:', {
      currentIndex,
      actualIndex,
      currentItem: sequence[currentIndex],
      previousItem: sequence[actualIndex],
      actualMatch,
      userSaid: isMatch,
      correct
    })

    setMoves(prev => prev + 1)

    // Update responses and correctAnswers together
    setUserResponses(prev => {
      const newResponses = [...prev, { index: currentIndex, response: isMatch, correct }]
      console.log('New responses:', newResponses)
      return newResponses
    })

    if (correct) {
      setCorrectAnswers(prev => {
        const newCorrect = prev + 1
        console.log('Correct answers:', newCorrect)
        const points = difficulty === 'easy' ? 50 : difficulty === 'medium' ? 100 : 150
        setScore(prevScore => prevScore + points)
        return newCorrect
      })
      setFeedback({ type: 'correct', message: '✓ To\'g\'ri!' })
    } else {
      setLives(prev => {
        const newLives = prev - 1
        if (newLives <= 0) {
          endGame(false)
        }
        return newLives
      })
      setFeedback({ type: 'wrong', message: '✗ Xato!' })
    }

    setTimeout(() => setFeedback(null), 800)
  }

  const endGame = (won = null) => {
    const accuracy = userResponses.length > 0
      ? (correctAnswers / userResponses.length) * 100
      : 0

    const finalWon = won !== null ? won : accuracy >= 60

    if (onGameEnd) {
      onGameEnd({
        won: finalWon,
        accuracy: Math.round(accuracy),
        correctAnswers,
        totalResponses: userResponses.length
      })
    }
  }

  const getInstructionText = () => {
    if (settings.nBack === 1) {
      return t('game.nback1Instruction') || 'Joriy element bir oldingi element bilan bir xilmi?'
    } else if (settings.nBack === 2) {
      return t('game.nback2Instruction') || 'Joriy element 2 qadam orqadagi element bilan bir xilmi?'
    } else {
      return t('game.nback3Instruction') || 'Joriy element 3 qadam orqadagi element bilan bir xilmi?'
    }
  }

  if (!gameStarted) {
    return (
      <div className="nback-game-container">
        <div className="nback-game-header">
          <button className="nback-quit-btn" onClick={onQuit}>
            ← {t('games.back') || 'Orqaga'}
          </button>
        </div>

        <div className="nback-intro">
          <div className="nback-intro-card">
            <div className="nback-icon">🧠</div>
            <h2 className="nback-title">
              {settings.nBack}-Back {t('game.challenge') || 'Sinov'}
            </h2>
            <p className="nback-description">
              {getInstructionText()}
            </p>

            <div className="nback-rules">
              <h3>📝 {t('game.rules') || 'Qoidalar'}:</h3>
              <ul>
                <li>{t('game.nbackRule1') || `Har bir element ${settings.speed/1000} soniya ko'rsatiladi`}</li>
                <li>{t('game.nbackRule2') || `${settings.nBack} qadam orqadagi element bilan bir xilligini tekshiring`}</li>
                <li>{t('game.nbackRule3') || '"Ha" yoki "Yo\'q" tugmasini bosing'}</li>
                <li>{t('game.nbackRule4') || 'Aniqlik 60%+ bo\'lsa, g\'alaba!'}</li>
              </ul>
            </div>

            <div className="nback-stats-preview">
              <div className="stat-preview-item">
                <span className="stat-icon">🎯</span>
                <span className="stat-text">{settings.sequenceLength} {t('game.items') || 'element'}</span>
              </div>
              <div className="stat-preview-item">
                <span className="stat-icon">⚡</span>
                <span className="stat-text">{settings.speed/1000}s / {t('game.item') || 'element'}</span>
              </div>
              <div className="stat-preview-item">
                <span className="stat-icon">🧮</span>
                <span className="stat-text">{settings.nBack}-Back</span>
              </div>
            </div>

            <button
              className="nback-start-btn"
              onClick={startGame}
            >
              <span className="btn-icon">🚀</span>
              {t('games.startGame') || 'Boshlash'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  const canRespond = currentIndex >= settings.nBack && !showingItem

  console.log('Render:', { currentIndex, nBack: settings.nBack, canRespond, showingItem, correctAnswers, responsesCount: userResponses.length })

  return (
    <div className="nback-game-container">
      <div className="nback-game-header">
        <button className="nback-quit-btn" onClick={onQuit}>
          ← {t('games.back') || 'Orqaga'}
        </button>
      </div>

      <div className="nback-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(currentIndex / sequence.length) * 100}%` }}
          />
        </div>
        <span className="progress-text">
          {currentIndex} / {sequence.length}
        </span>
      </div>

      <div className="nback-display">
        <div className={`nback-item ${showingItem ? 'show' : ''}`}>
          {currentItem || '•'}
        </div>

        {feedback && (
          <div className={`nback-feedback ${feedback.type}`}>
            {feedback.message}
          </div>
        )}
      </div>

      <div className="nback-instruction">
        {canRespond ? (
          <p>{getInstructionText()}</p>
        ) : showingItem ? (
          <p>👀 {t('game.watch') || 'Diqqat bilan kuzating'}</p>
        ) : (
          <p>⏳ {t('game.wait') || 'Kuting...'}</p>
        )}
      </div>

      <div className="nback-controls">
        <button
          className="nback-btn nback-btn-no"
          onClick={() => handleResponse(false)}
          disabled={!canRespond}
        >
          <span className="btn-icon">❌</span>
          <span className="btn-text">{t('game.no') || 'Yo\'q'}</span>
        </button>

        <button
          className="nback-btn nback-btn-yes"
          onClick={() => handleResponse(true)}
          disabled={!canRespond}
        >
          <span className="btn-icon">✓</span>
          <span className="btn-text">{t('game.yes') || 'Ha'}</span>
        </button>
      </div>

      <div className="nback-stats-live">
        <div className="live-stat">
          <span className="stat-label">{t('game.correct') || 'To\'g\'ri'}</span>
          <span className="stat-value">{correctAnswers}/{userResponses.length}</span>
        </div>
        <div className="live-stat">
          <span className="stat-label">{t('game.accuracy') || 'Aniqlik'}</span>
          <span className="stat-value">
            {userResponses.length > 0
              ? Math.round((correctAnswers / userResponses.length) * 100)
              : 0}%
          </span>
        </div>
      </div>
    </div>
  )
}

export default NBackGame
