import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import GameResultModal from './GameResultModal'

const MemoryCardGame = ({ onBack, difficulty = 'easy' }) => {
  const { updateUserStats } = useAuth()
  const allEmojis = ['🍎', '🍌', '🍊', '🍇', '🍓', '🥝', '🍑', '🍒', '🥭', '🍍', '🥥', '🥑']

  const getDifficultySettings = () => {
    switch (difficulty) {
      case 'easy':
        return { pairs: 4, timeLimit: null, emojis: allEmojis.slice(0, 4) }
      case 'medium':
        return { pairs: 6, timeLimit: 120, emojis: allEmojis.slice(0, 6) }
      case 'hard':
        return { pairs: 8, timeLimit: 90, emojis: allEmojis.slice(0, 8) }
      default:
        return { pairs: 4, timeLimit: null, emojis: allEmojis.slice(0, 4) }
    }
  }

  const [difficultySettings] = useState(() => getDifficultySettings())
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])
  const [moves, setMoves] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [gameLost, setGameLost] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [gameTime, setGameTime] = useState(0)
  const [score, setScore] = useState(0)
  const [showResultModal, setShowResultModal] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    if (gameStarted && !gameWon && !gameLost) {
      const timer = setInterval(() => {
        const currentTime = Math.floor((Date.now() - startTime) / 1000)
        setGameTime(currentTime)

        if (difficultySettings.timeLimit && currentTime >= difficultySettings.timeLimit) {
          setGameLost(true)
        }
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameStarted, gameWon, gameLost, startTime, difficultySettings.timeLimit])

  useEffect(() => {
    if (matchedCards.length === difficultySettings.pairs * 2 && gameStarted) {
      setGameWon(true)
      calculateScore()
    }
  }, [matchedCards, gameStarted, difficultySettings.pairs])

  const calculateScore = () => {
    const timeBonus = difficultySettings.timeLimit
      ? Math.max(0, difficultySettings.timeLimit - gameTime) * 10
      : Math.max(0, 300 - gameTime) * 5
    const movesPenalty = Math.max(0, moves - difficultySettings.pairs) * 5
    const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2

    const finalScore = Math.round((1000 + timeBonus - movesPenalty) * difficultyMultiplier)
    const calculatedScore = Math.max(0, finalScore)
    setScore(calculatedScore)

    const result = {
      gameType: 'memory_card',
      score: calculatedScore,
      difficulty,
      timeSpent: gameTime,
      moves,
      timestamp: new Date().toISOString()
    }

    setGameResult(result)
    setShowResultModal(true)
  }

  const initializeGame = () => {
    const gameCards = [...difficultySettings.emojis, ...difficultySettings.emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }))

    setCards(gameCards)
    setFlippedCards([])
    setMatchedCards([])
    setMoves(0)
    setGameStarted(false)
    setGameWon(false)
    setGameLost(false)
    setGameTime(0)
    setScore(0)
    setShowResultModal(false)
    setGameResult(null)
  }

  const handlePlayAgain = () => {
    setShowResultModal(false)
    initializeGame()
  }

  const handleSelectGame = () => {
    setShowResultModal(false)
    onBack() // Goes back to game selection
  }

  const handleMainMenu = () => {
    setShowResultModal(false)
    onBack()
  }

  const flipCard = (cardId) => {
    if (gameLost || gameWon) return

    if (!gameStarted) {
      setGameStarted(true)
      setStartTime(Date.now())
    }

    if (flippedCards.length === 2) return
    if (flippedCards.includes(cardId)) return
    if (matchedCards.includes(cardId)) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1)
      const [firstCard, secondCard] = newFlippedCards
      const firstCardData = cards.find(card => card.id === firstCard)
      const secondCardData = cards.find(card => card.id === secondCard)

      if (firstCardData.emoji === secondCardData.emoji) {
        setMatchedCards([...matchedCards, firstCard, secondCard])
        setFlippedCards([])
      } else {
        setTimeout(() => {
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyLabel = () => {
    return difficulty === 'easy' ? 'Oson' : difficulty === 'medium' ? 'O\'rta' : 'Qiyin'
  }

  const getRemainingTime = () => {
    if (!difficultySettings.timeLimit) return null
    return Math.max(0, difficultySettings.timeLimit - gameTime)
  }

  return (
    <div className="memory-card-game">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>
          ← Orqaga
        </button>
        <h2>🃏 Xotira Kartalari ({getDifficultyLabel()})</h2>

        <div className="game-stats">
          <span>🎯 Yurishlar: {moves}</span>
          <span>⏱️ Vaqt: {formatTime(gameTime)}</span>
          {difficultySettings.timeLimit && (
            <span className={`time-limit ${getRemainingTime() < 30 ? 'warning' : ''}`}>
              ⏰ Qolgan: {formatTime(getRemainingTime())}
            </span>
          )}
          {score > 0 && <span>⭐ Ball: {score}</span>}
        </div>
      </div>

      {gameWon && (
        <div className="victory-message">
          <h3>🎉 Tabriklaymiz!</h3>
          <p>O'yinni {moves} yurishda {formatTime(gameTime)} vaqt ichida tugatdingiz!</p>
          <p className="score-display">⭐ Sizning ballingiz: {score}</p>
          <button onClick={initializeGame} className="play-again-button">
            🔄 Yana O'ynash
          </button>
        </div>
      )}

      {gameLost && (
        <div className="defeat-message">
          <h3>😔 Vaqt tugadi!</h3>
          <p>Afsuski, vaqt tugab qoldi. Qaytadan urinib ko'ring!</p>
          <button onClick={initializeGame} className="play-again-button">
            🔄 Qaytadan Urinish
          </button>
        </div>
      )}

      <div className="cards-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`card ${
              flippedCards.includes(card.id) || matchedCards.includes(card.id)
                ? 'flipped'
                : ''
            } ${matchedCards.includes(card.id) ? 'matched' : ''}`}
            onClick={() => flipCard(card.id)}
          >
            <div className="card-inner">
              <div className="card-front">?</div>
              <div className="card-back">{card.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="game-controls">
        <button onClick={initializeGame} className="reset-button">
          🔄 Qaytadan Boshlash
        </button>
      </div>

      <div className="game-instructions">
        <h4>📝 Qoidalar:</h4>
        <ul>
          <li>Kartalarni bosing va juftlarini toping</li>
          <li>Bir vaqtning o'zida faqat 2 ta karta ochiladi</li>
          <li>Barcha juftlarni toping va g'olib bo'ling!</li>
        </ul>
      </div>

      <GameResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        gameResult={gameResult}
        onPlayAgain={handlePlayAgain}
        onSelectGame={handleSelectGame}
        onMainMenu={handleMainMenu}
      />
    </div>
  )
}

export default MemoryCardGame