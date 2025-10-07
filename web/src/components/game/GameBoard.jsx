import React, { useState, useEffect, useCallback } from 'react'
import Card from './Card'
import Timer from './Timer'
import ScoreCounter from './ScoreCounter'
import Button from '../ui/Button'
import { useAuth } from '../../contexts/AuthContext'
import { useLanguage } from '../../contexts/LanguageContext'

const GameBoard = ({
  gameType = 'memory-cards',
  difficulty = 'easy',
  onGameEnd,
  onPause,
  onQuit
}) => {
  const { user } = useAuth()
  const { t } = useLanguage()

  // Game configuration based on type and difficulty
  const getGameConfig = useCallback(() => {
    const configs = {
      'memory-cards': {
        easy: { pairs: 4, timeLimit: null, showTime: 1000 },
        medium: { pairs: 6, timeLimit: 120, showTime: 800 },
        hard: { pairs: 8, timeLimit: 90, showTime: 600 }
      },
      'number-sequence': {
        easy: { length: 3, timeLimit: null, showTime: 1000 },
        medium: { length: 4, timeLimit: 60, showTime: 800 },
        hard: { length: 5, timeLimit: 45, showTime: 600 }
      },
      'color-sequence': {
        easy: { length: 3, timeLimit: null, showTime: 800 },
        medium: { length: 4, timeLimit: 45, showTime: 600 },
        hard: { length: 5, timeLimit: 30, showTime: 400 }
      }
    }
    return configs[gameType][difficulty]
  }, [gameType, difficulty])

  // Game state
  const [gameConfig] = useState(getGameConfig())
  const [gameState, setGameState] = useState('waiting') // waiting, playing, paused, finished
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [lives, setLives] = useState(difficulty === 'easy' ? 5 : difficulty === 'medium' ? 3 : 2)

  // Memory Cards specific state
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])

  // Sequence games specific state
  const [sequence, setSequence] = useState([])
  const [userSequence, setUserSequence] = useState([])
  const [showingSequence, setShowingSequence] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(1)

  // Sound effects (optional)
  const playSound = useCallback((type) => {
    // Sound implementation would go here
    // For now, we'll use vibration on mobile devices
    if (navigator.vibrate && type === 'match') {
      navigator.vibrate(100)
    } else if (navigator.vibrate && type === 'wrong') {
      navigator.vibrate([100, 50, 100])
    }
  }, [])

  // Initialize game based on type
  useEffect(() => {
    initializeGame()
  }, [gameType, difficulty])

  const initializeGame = () => {
    setGameState('waiting')
    setScore(0)
    setMoves(0)
    setTime(gameConfig.timeLimit || 0)
    setLives(difficulty === 'easy' ? 5 : difficulty === 'medium' ? 3 : 2)

    if (gameType === 'memory-cards') {
      initializeMemoryCards()
    } else {
      initializeSequenceGame()
    }
  }

  const initializeMemoryCards = () => {
    const emojis = ['🍎', '🍌', '🍊', '🍇', '🍓', '🥝', '🍑', '🍒', '🥭', '🍍', '🥥', '🥑']
    const selectedEmojis = emojis.slice(0, gameConfig.pairs)
    const gameCards = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        content: emoji,
        isFlipped: false,
        isMatched: false
      }))

    setCards(gameCards)
    setFlippedCards([])
    setMatchedCards([])
  }

  const initializeSequenceGame = () => {
    setSequence([])
    setUserSequence([])
    setCurrentLevel(1)
    generateSequence(1)
  }

  const generateSequence = (level) => {
    const length = Math.min(level + 2, 10)
    const newSequence = []

    if (gameType === 'number-sequence') {
      for (let i = 0; i < length; i++) {
        newSequence.push(Math.floor(Math.random() * 9) + 1)
      }
    } else if (gameType === 'color-sequence') {
      const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
      for (let i = 0; i < length; i++) {
        newSequence.push(colors[Math.floor(Math.random() * colors.length)])
      }
    }

    setSequence(newSequence)
    setUserSequence([])
  }

  const startGame = () => {
    setGameState('playing')
    if (gameType !== 'memory-cards') {
      showSequenceToPlayer()
    }
  }

  const showSequenceToPlayer = async () => {
    setShowingSequence(true)

    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, gameConfig.showTime))
      // Highlight current item in sequence
    }

    setShowingSequence(false)
  }

  const handleCardClick = (cardId) => {
    if (gameState !== 'playing') return
    if (flippedCards.length >= 2) return
    if (flippedCards.includes(cardId)) return
    if (matchedCards.includes(cardId)) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)
    setMoves(moves + 1)

    if (newFlippedCards.length === 2) {
      const [firstCardId, secondCardId] = newFlippedCards
      const firstCard = cards.find(card => card.id === firstCardId)
      const secondCard = cards.find(card => card.id === secondCardId)

      if (firstCard.content === secondCard.content) {
        // Match found
        const newMatchedCards = [...matchedCards, firstCardId, secondCardId]
        setMatchedCards(newMatchedCards)
        setFlippedCards([])

        // Calculate score
        const matchBonus = 100 * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2)
        setScore(prev => prev + matchBonus)

        playSound('match')

        // Check if game is won
        if (newMatchedCards.length === cards.length) {
          endGame(true)
        }
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([])
          setLives(prev => {
            const newLives = prev - 1
            if (newLives <= 0) {
              endGame(false)
            }
            return newLives
          })
        }, 1000)

        playSound('wrong')
      }
    }
  }

  const handleSequenceInput = (value) => {
    if (gameState !== 'playing' || showingSequence) return

    const newUserSequence = [...userSequence, value]
    setUserSequence(newUserSequence)
    setMoves(moves + 1)

    // Check if current input is correct
    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      // Wrong input
      setLives(prev => {
        const newLives = prev - 1
        if (newLives <= 0) {
          endGame(false)
        }
        return newLives
      })
      setUserSequence([])
      playSound('wrong')
      return
    }

    // Check if sequence is complete
    if (newUserSequence.length === sequence.length) {
      // Sequence completed correctly
      const levelBonus = 200 * currentLevel * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2)
      setScore(prev => prev + levelBonus)

      playSound('match')

      // Next level
      const nextLevel = currentLevel + 1
      setCurrentLevel(nextLevel)
      generateSequence(nextLevel)

      // Check win condition (max level reached)
      if (nextLevel > 10) {
        endGame(true)
      } else {
        showSequenceToPlayer()
      }
    }
  }

  const handleTimeUp = () => {
    endGame(false)
  }

  const endGame = (won) => {
    setGameState('finished')

    const finalScore = calculateFinalScore(won)
    setScore(finalScore)

    if (onGameEnd) {
      onGameEnd({
        gameType,
        difficulty,
        score: finalScore,
        moves,
        timeSpent: gameConfig.timeLimit ? gameConfig.timeLimit - time : time,
        won,
        level: gameType === 'memory-cards' ? 1 : currentLevel
      })
    }
  }

  const calculateFinalScore = (won) => {
    let finalScore = score

    if (won) {
      // Win bonus
      finalScore += 500 * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2)

      // Time bonus (if time limit exists)
      if (gameConfig.timeLimit && time > 0) {
        finalScore += time * 10
      }

      // Efficiency bonus (fewer moves = higher score)
      const optimalMoves = gameType === 'memory-cards' ? gameConfig.pairs : currentLevel * 2
      if (moves <= optimalMoves) {
        finalScore += Math.max(0, (optimalMoves - moves) * 50)
      }
    }

    return Math.round(finalScore)
  }

  const getBestScore = () => {
    if (!user) return 0
    const gameKey = `${gameType}_${difficulty}`
    return user.stats.bestScores[gameKey] || 0
  }

  const pauseGame = () => {
    setGameState('paused')
    if (onPause) onPause()
  }

  const resumeGame = () => {
    setGameState('playing')
  }

  if (gameState === 'waiting') {
    return (
      <div className="game-board waiting">
        <div className="game-header">
          <h2>🎮 {gameType === 'memory-cards' ? t('games.memoryCardsTitle') :
                     gameType === 'number-sequence' ? t('games.numberSequenceTitle') : t('games.colorSequenceTitle')}</h2>
          <p className="difficulty-badge">{difficulty === 'easy' ? t('games.easy') : difficulty === 'medium' ? t('games.medium') : t('games.hard')}</p>
        </div>

        <div className="game-instructions">
          {gameType === 'memory-cards' ? (
            <div>
              <h3>📝 {t('game.rules')}</h3>
              <ul>
                <li>{t('game.memoryRule1')}</li>
                <li>{t('game.memoryRule2')}</li>
                <li>{t('game.memoryRule3')}</li>
              </ul>
            </div>
          ) : (
            <div>
              <h3>📝 {t('game.rules')}</h3>
              <ul>
                <li>{t('game.sequenceRule1')}</li>
                <li>{t('game.sequenceRule2')}</li>
                <li>{t('game.sequenceRule3')}</li>
              </ul>
            </div>
          )}
        </div>

        <div className="start-section">
          <Button
            variant="primary"
            size="large"
            onClick={startGame}
            icon="🚀"
          >
            {t('games.startGame')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`game-board ${gameState}`}>
      <div className="game-header">
        <div className="game-info">
          <h2>{gameType === 'memory-cards' ? t('games.memoryCardsTitle') :
                 gameType === 'number-sequence' ? t('games.numberSequenceTitle') : t('games.colorSequenceTitle')}</h2>
          <span className="level-info">
            {gameType === 'memory-cards' ?
              `${difficulty === 'easy' ? t('games.easy') : difficulty === 'medium' ? t('games.medium') : t('games.hard')} ${t('game.levelLabel')}` :
              `${t('game.levelNumber')} ${currentLevel}`
            }
          </span>
        </div>

        <div className="game-controls">
          <Button
            variant="outline"
            size="small"
            onClick={gameState === 'paused' ? resumeGame : pauseGame}
            icon={gameState === 'paused' ? '▶️' : '⏸️'}
          >
            {gameState === 'paused' ? t('game.resume') : t('game.pause')}
          </Button>

          <Button
            variant="danger"
            size="small"
            onClick={onQuit}
            icon="🚪"
          >
            {t('games.exit')}
          </Button>
        </div>
      </div>

      <div className="game-stats">
        <ScoreCounter
          score={score}
          bestScore={getBestScore()}
          size="medium"
        />

        <Timer
          isRunning={gameState === 'playing'}
          initialTime={gameConfig.timeLimit || 0}
          timeLimit={gameConfig.timeLimit}
          onTimeUpdate={setTime}
          onTimeUp={handleTimeUp}
        />

        <div className="game-metrics">
          <div className="metric">
            <span className="metric-icon">🎯</span>
            <span className="metric-label">{t('game.movesLabel')}</span>
            <span className="metric-value">{moves}</span>
          </div>

          <div className="metric">
            <span className="metric-icon">❤️</span>
            <span className="metric-label">{t('game.livesLabel')}</span>
            <span className="metric-value">{lives}</span>
          </div>
        </div>
      </div>

      <div className="game-area">
        {gameType === 'memory-cards' ? (
          <div className="cards-grid" style={{ '--pairs': gameConfig.pairs }}>
            {cards.map((card) => (
              <Card
                key={card.id}
                id={card.id}
                content={card.content}
                isFlipped={flippedCards.includes(card.id) || matchedCards.includes(card.id)}
                isMatched={matchedCards.includes(card.id)}
                isDisabled={gameState !== 'playing' || flippedCards.length >= 2}
                onClick={handleCardClick}
                size="medium"
              />
            ))}
          </div>
        ) : gameType === 'number-sequence' ? (
          <div className="sequence-game">
            <div className="sequence-display">
              {showingSequence ? (
                <div className="showing-sequence">
                  <h3>Diqqat bilan kuzating:</h3>
                  <div className="sequence-items">
                    {sequence.map((num, index) => (
                      <div key={index} className="sequence-item number">
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="input-sequence">
                  <h3>Ketma-ketlikni takrorlang:</h3>
                  <div className="number-grid">
                    {[1,2,3,4,5,6,7,8,9].map(num => (
                      <Button
                        key={num}
                        variant="outline"
                        size="large"
                        onClick={() => handleSequenceInput(num)}
                        disabled={gameState !== 'playing'}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="color-sequence-game">
            {/* Color sequence game implementation */}
            <div className="color-display">
              <h3>{showingSequence ? 'Ranglarni kuzating:' : 'Ranglarni takrorlang:'}</h3>
              <div className="color-grid">
                {['red', 'blue', 'green', 'yellow', 'purple', 'orange'].map(color => (
                  <button
                    key={color}
                    className={`color-button ${color}`}
                    onClick={() => handleSequenceInput(color)}
                    disabled={gameState !== 'playing' || showingSequence}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {gameState === 'paused' && (
        <div className="pause-overlay">
          <div className="pause-content">
            <h3>⏸️ O'yin to'xtatildi</h3>
            <p>Davom etish uchun "Davom" tugmasini bosing</p>
            <Button
              variant="primary"
              onClick={resumeGame}
              icon="▶️"
            >
              Davom etish
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameBoard