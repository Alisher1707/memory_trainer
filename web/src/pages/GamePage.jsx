import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import GameBoard from '../components/game/GameBoard'
import LevelSelector from '../components/game/LevelSelector'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'

const GamePage = ({
  gameType = null,
  level = null,
  onNavigate
}) => {
  const { isAuthenticated } = useAuth()
  const [selectedGame, setSelectedGame] = useState(gameType)
  const [selectedLevel, setSelectedLevel] = useState(level || 'easy')
  const [gameState, setGameState] = useState('selectGame') // selectGame, selectLevel, playing, paused, results
  const [gameResult, setGameResult] = useState(null)
  const [showQuitModal, setShowQuitModal] = useState(false)

  const games = [
    {
      id: 'memory-cards',
      title: 'Xotira Kartalari',
      description: 'Kartalarni aylantiring va juftlarini toping',
      icon: '🃏',
      bgColor: '#ff6b6b',
      features: ['Vizual xotira', 'Diqqat jamlash', 'Tezlik']
    },
    {
      id: 'number-sequence',
      title: 'Raqam Ketma-ketligi',
      description: 'Raqamlar ketma-ketligini eslab qoling',
      icon: '🔢',
      bgColor: '#4ecdc4',
      features: ['Raqamli xotira', 'Ketma-ketlik', 'Konsentratsiya']
    },
    {
      id: 'color-sequence',
      title: 'Rang Ketma-ketligi',
      description: 'Ranglar tartibini takrorlang',
      icon: '🌈',
      bgColor: '#ffe66d',
      features: ['Rang identifikatsiyasi', 'Pattern tanish', 'Tez javob']
    }
  ]

  useEffect(() => {
    if (gameType && level) {
      setSelectedGame(gameType)
      setSelectedLevel(level)
      setGameState('playing')
    } else if (gameType) {
      setSelectedGame(gameType)
      setGameState('selectLevel')
    }
  }, [gameType, level])

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId)
    setGameState('selectLevel')
  }

  const handleLevelSelect = (levelId) => {
    setSelectedLevel(levelId)
  }

  const handleStartGame = () => {
    setGameState('playing')
  }

  const handleGameEnd = (result) => {
    setGameResult(result)
    setGameState('results')
  }

  const handleGamePause = () => {
    setGameState('paused')
  }

  const handleGameQuit = () => {
    setShowQuitModal(true)
  }

  const confirmQuit = () => {
    setShowQuitModal(false)
    setGameState('selectGame')
    setSelectedGame(null)
    setSelectedLevel('easy')
    setGameResult(null)
  }

  const handlePlayAgain = () => {
    setGameResult(null)
    setGameState('playing')
  }

  const handleBackToMenu = () => {
    setGameState('selectGame')
    setSelectedGame(null)
    setSelectedLevel('easy')
    setGameResult(null)
  }

  const handleBackToHome = () => {
    onNavigate('home')
  }

  const currentGame = games.find(g => g.id === selectedGame)

  if (gameState === 'selectGame') {
    return (
      <div className="page-container">
        <div className="page-header">
          <Button
            variant="outline"
            onClick={handleBackToHome}
            icon="←"
          >
            Bosh sahifa
          </Button>
          <h1>🎮 O'yin Tanlang</h1>
          <div className="page-step">Qadam 1/2</div>
        </div>

        <div className="game-selection">
          <div className="selection-header">
            <h2>Qaysi o'yinni o'ynashni xohlaysiz?</h2>
            <p>Har bir o'yin turli ko'nikmalarni rivojlantiradi</p>
          </div>

          <div className="games-grid">
            {games.map((game) => (
              <div
                key={game.id}
                className="game-selection-card"
                style={{ '--bg-color': game.bgColor }}
                onClick={() => handleGameSelect(game.id)}
              >
                <div className="game-card-header">
                  <div className="game-icon-large">{game.icon}</div>
                </div>

                <div className="game-card-content">
                  <h3>{game.title}</h3>
                  <p className="game-description">{game.description}</p>

                  <div className="game-features">
                    {game.features.map((feature, index) => (
                      <span key={index} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <Button
                    variant="primary"
                    className="select-game-btn"
                    icon="➡️"
                  >
                    Tanlash
                  </Button>
                </div>

                <div className="card-hover-effect" />
              </div>
            ))}
          </div>

          <div className="selection-tips">
            <h3>💡 Maslahatlar:</h3>
            <ul>
              <li>Yangi boshlovchilar uchun <strong>Xotira Kartalari</strong> tavsiya etiladi</li>
              <li>Har bir o'yin turli miyaviy ko'nikmalarni rivojlantiradi</li>
              <li>Har kuni turli o'yinlarni o'ynab ko'ring</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === 'selectLevel') {
    return (
      <div className="page-container">
        <div className="page-header">
          <Button
            variant="outline"
            onClick={() => setGameState('selectGame')}
            icon="←"
          >
            Orqaga
          </Button>
          <h1>🎯 Daraja Tanlang</h1>
          <div className="page-step">Qadam 2/2</div>
        </div>

        <div className="level-selection">
          <div className="selected-game-preview">
            <div className="game-preview-card" style={{ '--bg-color': currentGame.bgColor }}>
              <span className="game-icon">{currentGame.icon}</span>
              <div className="game-details">
                <h3>{currentGame.title}</h3>
                <p>{currentGame.description}</p>
              </div>
            </div>
          </div>

          <LevelSelector
            selectedLevel={selectedLevel}
            onLevelSelect={handleLevelSelect}
            showPreview={true}
          />

          <div className="start-section">
            <Button
              variant="primary"
              size="large"
              onClick={handleStartGame}
              icon="🚀"
            >
              O'yinni Boshlash
            </Button>
            <p className="start-hint">
              Tayyor bo'lganingizda "Boshlash" tugmasini bosing
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === 'playing' || gameState === 'paused') {
    return (
      <div className="page-container game-page">
        <GameBoard
          gameType={selectedGame}
          difficulty={selectedLevel}
          onGameEnd={handleGameEnd}
          onPause={handleGamePause}
          onQuit={handleGameQuit}
        />

        <Modal
          isOpen={showQuitModal}
          onClose={() => setShowQuitModal(false)}
          title="O'yinni tark etish"
          size="small"
        >
          <div className="quit-modal-content">
            <p>Haqiqatan ham o'yinni tark etishni xohlaysizmi?</p>
            <p className="quit-warning">Joriy progress saqlanmaydi.</p>

            <div className="modal-actions">
              <Button
                variant="outline"
                onClick={() => setShowQuitModal(false)}
              >
                Bekor qilish
              </Button>
              <Button
                variant="danger"
                onClick={confirmQuit}
                icon="🚪"
              >
                Chiqish
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  if (gameState === 'results') {
    return (
      <div className="page-container">
        <div className="results-page">
          <div className="results-header">
            <div className="game-info">
              <span className="game-icon">{currentGame.icon}</span>
              <div className="game-details">
                <h2>O'yin Tugadi!</h2>
                <p>{currentGame.title} - {selectedLevel === 'easy' ? 'Oson' : selectedLevel === 'medium' ? 'O\'rta' : 'Qiyin'}</p>
              </div>
            </div>
          </div>

          <div className="results-content">
            <div className="score-section">
              <div className="main-score">
                <div className="score-circle">
                  <span className="score-emoji">
                    {gameResult.score >= 2000 ? '🔥' :
                     gameResult.score >= 1500 ? '⭐' :
                     gameResult.score >= 1000 ? '👍' : '💪'}
                  </span>
                  <span className="score-value">{gameResult.score}</span>
                  <span className="score-label">Ball</span>
                </div>
              </div>

              <div className="score-rating">
                <h3>
                  {gameResult.score >= 2000 ? 'Ajoyib!' :
                   gameResult.score >= 1500 ? 'Yaxshi!' :
                   gameResult.score >= 1000 ? 'Zo\'r!' : 'Mashq qiling!'}
                </h3>
              </div>
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

              <div className="stat-item">
                <span className="stat-icon">🏆</span>
                <span className="stat-label">Natija</span>
                <span className="stat-value">{gameResult.won ? 'G\'alaba' : 'Mag\'lubiyat'}</span>
              </div>
            </div>

            {!isAuthenticated && (
              <div className="auth-prompt">
                <div className="auth-card">
                  <h3>🔐 Natijalarni saqlash</h3>
                  <p>Natijalaringizni saqlash va reytingda qatnashish uchun tizimga kiring</p>
                  <Button
                    variant="primary"
                    onClick={() => onNavigate('auth')}
                    icon="📝"
                  >
                    Ro'yxatdan O'tish
                  </Button>
                </div>
              </div>
            )}

            <div className="action-buttons">
              <Button
                variant="primary"
                size="large"
                onClick={handlePlayAgain}
                icon="🔄"
              >
                Yana O'ynash
              </Button>

              <Button
                variant="outline"
                size="large"
                onClick={handleBackToMenu}
                icon="🎮"
              >
                Boshqa O'yin
              </Button>

              <Button
                variant="outline"
                onClick={handleBackToHome}
                icon="🏠"
              >
                Bosh Sahifa
              </Button>
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
      </div>
    )
  }

  return null
}

export default GamePage