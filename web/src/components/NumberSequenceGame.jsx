import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const NumberSequenceGame = ({ onBack, difficulty = 'easy' }) => {
  const { updateUserStats } = useAuth()

  const getDifficultySettings = () => {
    switch (difficulty) {
      case 'easy':
        return { startLength: 3, maxLevel: 8, showTime: 1000, lives: 5 }
      case 'medium':
        return { startLength: 4, maxLevel: 12, showTime: 800, lives: 3 }
      case 'hard':
        return { startLength: 5, maxLevel: 15, showTime: 600, lives: 2 }
      default:
        return { startLength: 3, maxLevel: 8, showTime: 1000, lives: 5 }
    }
  }

  const [difficultySettings] = useState(() => getDifficultySettings())
  const [sequence, setSequence] = useState([])
  const [userSequence, setUserSequence] = useState([])
  const [currentLevel, setCurrentLevel] = useState(1)
  const [gameState, setGameState] = useState('waiting') // waiting, showing, input, correct, wrong, gameover
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(difficultySettings.lives)
  const [showingIndex, setShowingIndex] = useState(0)
  const [message, setMessage] = useState('')
  const [gameStartTime, setGameStartTime] = useState(null)

  useEffect(() => {
    generateSequence()
  }, [currentLevel])

  const generateSequence = () => {
    const newSequence = []
    for (let i = 0; i < currentLevel + 2; i++) {
      newSequence.push(Math.floor(Math.random() * 9) + 1)
    }
    setSequence(newSequence)
    setUserSequence([])
    setGameState('waiting')
    setMessage(`Daraja ${currentLevel} - ${newSequence.length} ta raqam`)
  }

  const startGame = () => {
    setGameState('showing')
    setShowingIndex(0)
    setMessage('Raqamlarni diqqat bilan kuzating...')
    showSequence()
  }

  const showSequence = () => {
    let index = 0
    const showInterval = setInterval(() => {
      setShowingIndex(index)
      index++

      if (index > sequence.length) {
        clearInterval(showInterval)
        setShowingIndex(-1)
        setGameState('input')
        setMessage('Endi raqamlarni tartib bilan bosing!')
      }
    }, 800)
  }

  const handleNumberClick = (number) => {
    if (gameState !== 'input') return

    const newUserSequence = [...userSequence, number]
    setUserSequence(newUserSequence)

    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      setGameState('wrong')
      setMessage('❌ Noto\'g\'ri! O\'yin tugadi.')
      return
    }

    if (newUserSequence.length === sequence.length) {
      setGameState('correct')
      setScore(score + currentLevel * 10)
      setCurrentLevel(currentLevel + 1)
      setMessage('✅ To\'g\'ri! Keyingi darajaga o\'tamiz...')

      setTimeout(() => {
        generateSequence()
      }, 2000)
    }
  }

  const resetGame = () => {
    setCurrentLevel(1)
    setScore(0)
    setUserSequence([])
    generateSequence()
  }

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  return (
    <div className="number-sequence-game">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>
          ← Orqaga
        </button>
        <h2>🔢 Raqam Ketma-ketligi</h2>

        <div className="game-stats">
          <span>📊 Daraja: {currentLevel}</span>
          <span>🏆 Ball: {score}</span>
        </div>
      </div>

      <div className="game-message">
        <p>{message}</p>
      </div>

      {gameState === 'showing' && (
        <div className="sequence-display">
          <h3>Raqamlar ketma-ketligi:</h3>
          <div className="sequence-numbers">
            {sequence.map((num, index) => (
              <div
                key={index}
                className={`sequence-number ${
                  index === showingIndex ? 'active' : ''
                } ${index < showingIndex ? 'shown' : ''}`}
              >
                {index <= showingIndex ? num : '?'}
              </div>
            ))}
          </div>
        </div>
      )}

      {gameState === 'input' && (
        <div className="user-input">
          <h3>Raqamlarni tartib bilan bosing:</h3>
          <div className="input-progress">
            {userSequence.map((num, index) => (
              <span key={index} className="input-number">
                {num}
              </span>
            ))}
            <span className="input-cursor">
              {userSequence.length < sequence.length ? '_' : ''}
            </span>
          </div>
        </div>
      )}

      <div className="number-pad">
        {numbers.map((number) => (
          <button
            key={number}
            className={`number-button ${
              gameState === 'showing' && sequence[showingIndex] === number
                ? 'highlighted'
                : ''
            }`}
            onClick={() => handleNumberClick(number)}
            disabled={gameState !== 'input'}
          >
            {number}
          </button>
        ))}
      </div>

      <div className="game-controls">
        {gameState === 'waiting' && (
          <button onClick={startGame} className="start-button">
            🚀 Boshlash
          </button>
        )}

        {(gameState === 'wrong' || gameState === 'correct') && (
          <button onClick={resetGame} className="reset-button">
            🔄 Qaytadan Boshlash
          </button>
        )}
      </div>

      <div className="game-instructions">
        <h4>📝 Qoidalar:</h4>
        <ul>
          <li>Raqamlar ketma-ketligini diqqat bilan kuzating</li>
          <li>Keyin ularni aynan shu tartibda bosing</li>
          <li>Har darajada raqamlar soni ortadi</li>
          <li>Xato qilsangiz o'yin tugaydi</li>
        </ul>
      </div>
    </div>
  )
}

export default NumberSequenceGame