import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

const MentalMathGame = ({
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

  // Game settings based on difficulty
  const getSettings = () => {
    switch(difficulty) {
      case 'easy':
        return {
          timePerQuestion: 10,
          totalQuestions: 15,
          operations: ['+', '-'],
          numberRange: [1, 20]
        }
      case 'medium':
        return {
          timePerQuestion: 8,
          totalQuestions: 20,
          operations: ['+', '-', '×'],
          numberRange: [1, 50]
        }
      case 'hard':
        return {
          timePerQuestion: 6,
          totalQuestions: 25,
          operations: ['+', '-', '×', '÷'],
          numberRange: [1, 100]
        }
      default:
        return {
          timePerQuestion: 10,
          totalQuestions: 15,
          operations: ['+', '-'],
          numberRange: [1, 20]
        }
    }
  }

  const settings = getSettings()
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [questionNumber, setQuestionNumber] = useState(1)
  const [timeLeft, setTimeLeft] = useState(settings.timePerQuestion)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [gameStarted, setGameStarted] = useState(false)

  // Generate random number
  const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  // Generate question
  const generateQuestion = () => {
    const [min, max] = settings.numberRange
    const operation = settings.operations[Math.floor(Math.random() * settings.operations.length)]

    let num1, num2, answer

    switch(operation) {
      case '+':
        num1 = randomNumber(min, max)
        num2 = randomNumber(min, max)
        answer = num1 + num2
        break
      case '-':
        num1 = randomNumber(min + 10, max)
        num2 = randomNumber(min, num1)
        answer = num1 - num2
        break
      case '×':
        num1 = randomNumber(2, 12)
        num2 = randomNumber(2, 12)
        answer = num1 * num2
        break
      case '÷':
        num2 = randomNumber(2, 12)
        answer = randomNumber(2, 12)
        num1 = num2 * answer
        break
      default:
        num1 = randomNumber(min, max)
        num2 = randomNumber(min, max)
        answer = num1 + num2
    }

    return {
      num1,
      num2,
      operation,
      answer,
      display: `${num1} ${operation} ${num2}`
    }
  }

  // Start game
  useEffect(() => {
    if (!gameStarted) {
      setCurrentQuestion(generateQuestion())
      setGameStarted(true)
    }
  }, [])

  // Timer
  useEffect(() => {
    if (!gameStarted || gameState !== 'playing') return

    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      // Time's up
      handleTimeUp()
    }
  }, [timeLeft, gameStarted, gameState])

  const handleTimeUp = () => {
    setLives(prev => {
      const newLives = prev - 1
      if (newLives <= 0) {
        endGame(false)
      }
      return newLives
    })
    setFeedback({ type: 'timeout', message: '⏰ Vaqt tugadi!' })
    setTimeout(() => {
      nextQuestion()
    }, 1000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    checkAnswer()
  }

  const checkAnswer = () => {
    if (userAnswer === '') return

    const isCorrect = parseInt(userAnswer) === currentQuestion.answer
    setMoves(prev => prev + 1)

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1)
      const timeBonus = timeLeft * 10
      const basePoints = difficulty === 'easy' ? 50 : difficulty === 'medium' ? 100 : 150
      const points = basePoints + timeBonus
      setScore(prev => prev + points)
      setFeedback({ type: 'correct', message: '✓ To\'g\'ri!' })
    } else {
      setLives(prev => {
        const newLives = prev - 1
        if (newLives <= 0) {
          endGame(false)
        }
        return newLives
      })
      setFeedback({ type: 'wrong', message: `✗ Xato! To'g'ri javob: ${currentQuestion.answer}` })
    }

    setTimeout(() => {
      nextQuestion()
    }, 1500)
  }

  const nextQuestion = () => {
    setFeedback(null)
    setUserAnswer('')

    if (questionNumber >= settings.totalQuestions) {
      endGame(true)
    } else {
      setQuestionNumber(prev => prev + 1)
      setCurrentQuestion(generateQuestion())
      setTimeLeft(settings.timePerQuestion)
    }
  }

  const endGame = (completed = false) => {
    const accuracy = moves > 0 ? (correctAnswers / moves) * 100 : 0
    const won = completed && accuracy >= 60

    if (onGameEnd) {
      onGameEnd({
        won,
        accuracy: Math.round(accuracy),
        correctAnswers,
        totalQuestions: questionNumber - 1
      })
    }
  }

  if (!currentQuestion) return null

  return (
    <div className="mental-math-game">
      <div className="math-game-header">
        <button className="math-quit-btn" onClick={onQuit}>
          ← {t('games.back') || 'Orqaga'}
        </button>
        <div className="math-question-counter">
          {questionNumber} / {settings.totalQuestions}
        </div>
      </div>

      <div className="math-timer-bar">
        <div
          className="math-timer-fill"
          style={{
            width: `${(timeLeft / settings.timePerQuestion) * 100}%`,
            backgroundColor: timeLeft <= 3 ? '#ef4444' : timeLeft <= 5 ? '#f59e0b' : '#10b981'
          }}
        />
      </div>

      <div className="math-question-display">
        <div className="math-question-text">
          {currentQuestion.display} = ?
        </div>

        {feedback && (
          <div className={`math-feedback ${feedback.type}`}>
            {feedback.message}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="math-answer-form">
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="math-input"
          placeholder={t('game.yourAnswer') || 'Javobingiz...'}
          autoFocus
          disabled={feedback !== null}
        />
        <button
          type="submit"
          className="math-submit-btn"
          disabled={userAnswer === '' || feedback !== null}
        >
          {t('game.check') || 'Tekshirish'} →
        </button>
      </form>

      <div className="math-stats">
        <div className="math-stat">
          <span className="stat-icon">⏱️</span>
          <span className="stat-value">{timeLeft}s</span>
        </div>
        <div className="math-stat">
          <span className="stat-icon">✓</span>
          <span className="stat-value">{correctAnswers}/{moves}</span>
        </div>
        <div className="math-stat">
          <span className="stat-icon">🎯</span>
          <span className="stat-value">
            {moves > 0 ? Math.round((correctAnswers / moves) * 100) : 0}%
          </span>
        </div>
      </div>

      <div className="math-keyboard">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
          <button
            key={num}
            className="math-key"
            onClick={() => setUserAnswer(prev => prev + num)}
            disabled={feedback !== null}
          >
            {num}
          </button>
        ))}
        <button
          className="math-key math-key-clear"
          onClick={() => setUserAnswer('')}
          disabled={feedback !== null}
        >
          ←
        </button>
      </div>
    </div>
  )
}

export default MentalMathGame
