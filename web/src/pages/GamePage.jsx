import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
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
  const { t } = useLanguage()
  const [selectedGame, setSelectedGame] = useState(gameType)
  const [selectedLevel, setSelectedLevel] = useState(level || 'easy')
  const [gameState, setGameState] = useState('selectGame') // selectGame, selectLevel, playing, paused, results
  const [gameResult, setGameResult] = useState(null)
  const [showQuitModal, setShowQuitModal] = useState(false)

  const games = [
    {
      id: 'n-back',
      title: t('games.nBackTitle'),
      description: t('games.nBackDesc'),
      icon: '🧠',
      bgColor: '#667eea',
      features: [t('games.feature10'), t('games.feature11'), t('games.feature12')]
    },
    {
      id: 'number-sequence',
      title: t('games.numberSequenceTitle'),
      description: t('games.numberSequenceDesc'),
      icon: '🔢',
      bgColor: '#4ecdc4',
      features: [t('games.feature6'), t('games.feature4'), t('games.feature5')]
    },
    {
      id: 'mental-math',
      title: t('games.mentalMathTitle'),
      description: t('games.mentalMathDesc'),
      icon: '🧮',
      bgColor: '#f59e0b',
      features: [t('games.feature13'), t('games.feature14'), t('games.feature15')]
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
            size="small"
            onClick={handleBackToHome}
            icon="←"
          >
            {t('games.homeButton')}
          </Button>
          <h1>🎮 {t('games.selectGame')}</h1>
          <div className="page-step">{t('games.step')} 1/2</div>
        </div>

        <div className="game-selection">
          <div className="selection-header">
            <h2>{t('games.whichGame')}</h2>
            <p>{t('games.eachGameDevelops')}</p>
          </div>

          <div className="games-grid">
            {games.map((game) => (
              <div
                key={game.id}
                className="game-selection-card"
                style={{ '--bg-color': game.bgColor }}
              >
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
                    onClick={() => handleGameSelect(game.id)}
                  >
                    {t('games.selectButton')}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="selection-tips">
            <h3>💡 {t('games.tips')}</h3>
            <ul>
              <li>{t('games.gamePageTip1')}</li>
              <li>{t('games.gamePageTip2')}</li>
              <li>{t('games.gamePageTip3')}</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === 'selectLevel') {
    if (!currentGame) {
      setGameState('selectGame')
      return null
    }

    return (
      <div className="page-container">
        <div className="page-header">
          <Button
            variant="outline"
            size="small"
            onClick={() => setGameState('selectGame')}
            icon="←"
          >
            {t('games.back')}
          </Button>
          <h1>🎯 {t('games.selectLevel')}</h1>
          <div className="page-step">{t('games.step')} 2/2</div>
        </div>

        <div className="level-selection">
          <div className="selected-game-preview">
            <div className="game-preview-card">
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
              size="medium"
              onClick={handleStartGame}
              icon="🚀"
            >
              {t('games.startGame')}
            </Button>
            <p className="start-hint">
              {t('games.readyToStart')}
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
          title={t('games.quitGame')}
          size="small"
        >
          <div className="quit-modal-content">
            <p>{t('games.quitConfirm')}</p>
            <p className="quit-warning">{t('games.progressNotSaved')}</p>

            <div className="modal-actions">
              <Button
                variant="outline"
                onClick={() => setShowQuitModal(false)}
              >
                {t('modal.cancel')}
              </Button>
              <Button
                variant="danger"
                onClick={confirmQuit}
                icon="🚪"
              >
                {t('games.exit')}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  if (gameState === 'results') {
    if (!currentGame) {
      setGameState('selectGame')
      return null
    }

    return (
      <div className="page-container">
        <div className="results-page">
          <div className="results-header">
            <div className="game-info">
              <div className="header-score-badge">
                <span className="header-score-value">{gameResult.score}</span>
              </div>
              <div className="game-details">
                <h2>{t('game.gameEnded')}</h2>
                <p>{currentGame.title} - {selectedLevel === 'easy' ? t('games.easy') : selectedLevel === 'medium' ? t('games.medium') : t('games.hard')}</p>
              </div>
            </div>
          </div>

          <div className="results-content">
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

              <div className="stat-item">
                <span className="stat-icon">🏆</span>
                <span className="stat-label">{t('games.result')}</span>
                <span className="stat-value">{gameResult.won ? t('games.victory') : t('games.defeat')}</span>
              </div>
            </div>

            {!isAuthenticated && (
              <div className="auth-prompt">
                <div className="auth-card">
                  <h3>🔐 {t('games.saveResults')}</h3>
                  <p>{t('games.saveResultsDesc')}</p>
                  <Button
                    variant="primary"
                    onClick={() => onNavigate('auth')}
                    icon="📝"
                  >
                    {t('games.register')}
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
                {t('game.playAgainButton')}
              </Button>

              <Button
                variant="outline"
                size="large"
                onClick={handleBackToMenu}
                icon="🎮"
              >
                {t('games.anotherGame')}
              </Button>

              <Button
                variant="outline"
                onClick={handleBackToHome}
                icon="🏠"
              >
                {t('games.homeButton')}
              </Button>
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
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default GamePage