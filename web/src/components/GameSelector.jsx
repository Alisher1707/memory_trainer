import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const GameSelector = ({ onStartGame, onBack }) => {
  const { t } = useLanguage()
  const [selectedGame, setSelectedGame] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy')
  const [step, setStep] = useState('selectGame') // selectGame, selectDifficulty

  const games = [
    {
      id: 'memory-cards',
      title: t('games.memoryCardsTitle'),
      description: t('games.memoryCardsDesc'),
      icon: '🃏',
      bgColor: '#ff6b6b',
      features: [t('games.feature3'), t('games.feature1'), t('games.feature2')]
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
      id: 'color-sequence',
      title: t('games.colorSequenceTitle'),
      description: t('games.colorSequenceDesc'),
      icon: '🌈',
      bgColor: '#ffe66d',
      features: [t('games.feature9'), t('games.feature7'), t('games.feature8')]
    }
  ]

  const difficulties = [
    {
      id: 'easy',
      name: t('games.easyName'),
      icon: '😊',
      description: t('games.easyDesc'),
      details: t('games.easyDetails')
    },
    {
      id: 'medium',
      name: t('games.mediumName'),
      icon: '🤔',
      description: t('games.mediumDesc'),
      details: t('games.mediumDetails')
    },
    {
      id: 'hard',
      name: t('games.hardName'),
      icon: '😤',
      description: t('games.hardDesc'),
      details: t('games.hardDetails')
    }
  ]

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId)
    setStep('selectDifficulty')
  }

  const handleStartGame = () => {
    onStartGame(selectedGame, selectedDifficulty)
  }

  const handleBack = () => {
    if (step === 'selectDifficulty') {
      setStep('selectGame')
      setSelectedGame(null)
    } else {
      onBack()
    }
  }

  if (step === 'selectGame') {
    return (
      <div className="game-selector">
        <div className="selector-header">
          <button className="back-button" onClick={handleBack}>
            ← {t('games.back')}
          </button>
          <h2>🎮 {t('games.selectGame')}</h2>
          <p className="step-indicator">{t('games.step')} 1/2</p>
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

                <button className="select-game-btn">
                  {t('games.selectButton')} ➡️
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="tips-section">
          <h3>💡 {t('games.tips')}</h3>
          <ul>
            <li>{t('games.tip1')}</li>
            <li>{t('games.tip2')}</li>
            <li>{t('games.tip3')}</li>
          </ul>
        </div>
      </div>
    )
  }

  const currentGame = games.find(g => g.id === selectedGame)

  return (
    <div className="game-selector difficulty-selection">
      <div className="selector-header">
        <button className="back-button" onClick={handleBack}>
          ← {t('games.back')}
        </button>
        <h2>🎯 {t('games.selectLevel')}</h2>
        <p className="step-indicator">{t('games.step')} 2/2</p>
      </div>

      <div className="selected-game-info">
        <div className="game-preview">
          <span className="game-icon">{currentGame.icon}</span>
          <div className="game-details">
            <h3>{currentGame.title}</h3>
            <p>{currentGame.description}</p>
          </div>
        </div>
      </div>

      <div className="difficulty-selector">
        <h3>{t('games.selectDifficultyTitle')}</h3>
        <div className="difficulty-cards">
          {difficulties.map((diff) => (
            <div
              key={diff.id}
              className={`difficulty-card ${selectedDifficulty === diff.id ? 'selected' : ''}`}
              onClick={() => setSelectedDifficulty(diff.id)}
            >
              <div className="difficulty-header">
                <span className="diff-icon">{diff.icon}</span>
                <h4>{diff.name}</h4>
              </div>
              <p className="diff-description">{diff.description}</p>
              <p className="diff-details">{diff.details}</p>
              <div className="selection-indicator">
                {selectedDifficulty === diff.id ? `✅ ${t('games.selected')}` : t('games.selectButton')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="start-section">
        <button className="start-game-button" onClick={handleStartGame}>
          🚀 {t('games.startGame')}
        </button>
        <p className="game-start-hint">
          {t('games.readyToStart')}
        </p>
      </div>
    </div>
  )
}

export default GameSelector