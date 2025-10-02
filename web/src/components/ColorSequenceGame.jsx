import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

const ColorSequenceGame = ({ onBack, difficulty = 'easy' }) => {
  const { updateUserStats } = useAuth()

  const getDifficultySettings = () => {
    switch (difficulty) {
      case 'easy':
        return {
          colors: [
            { id: 'red', name: 'Qizil', color: '#ff4757', sound: '🔴' },
            { id: 'blue', name: 'Kok', color: '#3742fa', sound: '🔵' },
            { id: 'green', name: 'Yashil', color: '#2ed573', sound: '🟢' },
            { id: 'yellow', name: 'Sariq', color: '#ffa502', sound: '🟡' }
          ],
          startLength: 3,
          maxLevel: 8,
          showTime: 800,
          lives: 5
        }
      case 'medium':
        return {
          colors: [
            { id: 'red', name: 'Qizil', color: '#ff4757', sound: '🔴' },
            { id: 'blue', name: 'Kok', color: '#3742fa', sound: '🔵' },
            { id: 'green', name: 'Yashil', color: '#2ed573', sound: '🟢' },
            { id: 'yellow', name: 'Sariq', color: '#ffa502', sound: '🟡' },
            { id: 'purple', name: 'Binafsha', color: '#a55eea', sound: '🟣' },
            { id: 'orange', name: 'To\'q sariq', color: '#ff6348', sound: '🟠' }
          ],
          startLength: 4,
          maxLevel: 12,
          showTime: 600,
          lives: 3
        }
      case 'hard':
        return {
          colors: [
            { id: 'red', name: 'Qizil', color: '#ff4757', sound: '🔴' },
            { id: 'blue', name: 'Kok', color: '#3742fa', sound: '🔵' },
            { id: 'green', name: 'Yashil', color: '#2ed573', sound: '🟢' },
            { id: 'yellow', name: 'Sariq', color: '#ffa502', sound: '🟡' },
            { id: 'purple', name: 'Binafsha', color: '#a55eea', sound: '🟣' },
            { id: 'orange', name: 'To\'q sariq', color: '#ff6348', sound: '🟠' },
            { id: 'pink', name: 'Pushti', color: '#ff3838', sound: '🩷' },
            { id: 'cyan', name: 'Zangori', color: '#00d2d3', sound: '🩵' }
          ],
          startLength: 5,
          maxLevel: 15,
          showTime: 400,
          lives: 2
        }
      default:
        return {
          colors: [
            { id: 'red', name: 'Qizil', color: '#ff4757', sound: '🔴' },
            { id: 'blue', name: 'Kok', color: '#3742fa', sound: '🔵' },
            { id: 'green', name: 'Yashil', color: '#2ed573', sound: '🟢' },
            { id: 'yellow', name: 'Sariq', color: '#ffa502', sound: '🟡' }
          ],
          startLength: 3,
          maxLevel: 8,
          showTime: 800,
          lives: 5
        }
    }
  }

  const [difficultySettings] = useState(() => getDifficultySettings())
  const [sequence, setSequence] = useState([])
  const [userSequence, setUserSequence] = useState([])
  const [currentLevel, setCurrentLevel] = useState(1)
  const [gameState, setGameState] = useState('waiting') // waiting, showing, input, correct, wrong, gameover
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(difficultySettings.lives)
  const [showingIndex, setShowingIndex] = useState(-1)
  const [message, setMessage] = useState('')
  const [activeColor, setActiveColor] = useState(null)
  const [gameStartTime, setGameStartTime] = useState(null)

  useEffect(() => {
    generateSequence()
  }, [currentLevel])

  const generateSequence = () => {
    const sequenceLength = Math.min(currentLevel + 2, 10)
    const newSequence = []
    for (let i = 0; i < sequenceLength; i++) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      newSequence.push(randomColor)
    }
    setSequence(newSequence)
    setUserSequence([])
    setGameState('waiting')
    setMessage(`Daraja ${currentLevel} - ${sequenceLength} ta rang`)
  }

  const startGame = () => {
    setGameState('showing')
    setMessage('Ranglar ketma-ketligini diqqat bilan kuzating...')
    showSequence()
  }

  const showSequence = async () => {
    for (let i = 0; i < sequence.length; i++) {
      setShowingIndex(i)
      setActiveColor(sequence[i].id)

      await new Promise(resolve => setTimeout(resolve, 600))
      setActiveColor(null)
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    setShowingIndex(-1)
    setGameState('input')
    setMessage('Endi ranglarni tartib bilan bosing!')
  }

  const handleColorClick = (color) => {
    if (gameState !== 'input') return

    setActiveColor(color.id)
    setTimeout(() => setActiveColor(null), 200)

    const newUserSequence = [...userSequence, color]
    setUserSequence(newUserSequence)

    const currentIndex = newUserSequence.length - 1
    if (newUserSequence[currentIndex].id !== sequence[currentIndex].id) {
      setGameState('wrong')
      setMessage('❌ Noto\'g\'ri rang! O\'yin tugadi.')
      return
    }

    if (newUserSequence.length === sequence.length) {
      setGameState('correct')
      setScore(score + currentLevel * 15)
      setCurrentLevel(currentLevel + 1)
      setMessage('✅ Ajoyib! Keyingi darajaga o\'tamiz...')

      setTimeout(() => {
        generateSequence()
      }, 2000)
    }
  }

  const resetGame = () => {
    setCurrentLevel(1)
    setScore(0)
    setUserSequence([])
    setActiveColor(null)
    generateSequence()
  }

  return (
    <div className="color-sequence-game">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>
          ← Orqaga
        </button>
        <h2>🌈 Rang Ketma-ketligi</h2>

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
          <h3>Ranglar ketma-ketligi:</h3>
          <div className="sequence-colors">
            {sequence.map((color, index) => (
              <div
                key={index}
                className={`sequence-color ${
                  index === showingIndex ? 'active' : ''
                }`}
                style={{
                  backgroundColor: index <= showingIndex ? color.color : '#ddd'
                }}
              >
                {index <= showingIndex ? color.sound : '❓'}
              </div>
            ))}
          </div>
        </div>
      )}

      {gameState === 'input' && (
        <div className="user-input">
          <h3>Ranglarni tartib bilan bosing:</h3>
          <div className="input-progress">
            {userSequence.map((color, index) => (
              <div
                key={index}
                className="input-color"
                style={{ backgroundColor: color.color }}
              >
                {color.sound}
              </div>
            ))}
            {userSequence.length < sequence.length && (
              <div className="input-cursor">❓</div>
            )}
          </div>
        </div>
      )}

      <div className="color-pad">
        {colors.map((color) => (
          <button
            key={color.id}
            className={`color-button ${
              activeColor === color.id ? 'active' : ''
            }`}
            style={{
              backgroundColor: color.color,
              transform: activeColor === color.id ? 'scale(1.1)' : 'scale(1)'
            }}
            onClick={() => handleColorClick(color)}
            disabled={gameState === 'showing'}
          >
            <span className="color-emoji">{color.sound}</span>
            <span className="color-name">{color.name}</span>
          </button>
        ))}
      </div>

      <div className="game-controls">
        {gameState === 'waiting' && (
          <button onClick={startGame} className="start-button">
            🚀 Boshlash
          </button>
        )}

        {(gameState === 'wrong') && (
          <button onClick={resetGame} className="reset-button">
            🔄 Qaytadan Boshlash
          </button>
        )}
      </div>

      <div className="game-instructions">
        <h4>📝 Qoidalar:</h4>
        <ul>
          <li>Ranglar ketma-ketligini diqqat bilan kuzating</li>
          <li>Keyin ularni aynan shu tartibda bosing</li>
          <li>Har darajada ranglar soni ortadi</li>
          <li>Xato qilsangiz o'yin tugaydi</li>
        </ul>
      </div>
    </div>
  )
}

export default ColorSequenceGame