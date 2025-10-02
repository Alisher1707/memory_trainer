import React, { useState } from 'react'

const GameSelector = ({ onStartGame, onBack }) => {
  const [selectedGame, setSelectedGame] = useState(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy')
  const [step, setStep] = useState('selectGame') // selectGame, selectDifficulty

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
      description: 'Ko\'rsatilgan raqamlar ketma-ketligini takrorlang',
      icon: '🔢',
      bgColor: '#4ecdc4',
      features: ['Raqamli xotira', 'Ketma-ketlik', 'Konsentratsiya']
    },
    {
      id: 'color-sequence',
      title: 'Rang Ketma-ketligi',
      description: 'Ranglar tartibini eslab qoling va takrorlang',
      icon: '🌈',
      bgColor: '#ffe66d',
      features: ['Rang identifikatsiyasi', 'Pattern tanish', 'Tez javob']
    }
  ]

  const difficulties = [
    {
      id: 'easy',
      name: 'Oson',
      icon: '😊',
      description: 'Yangi boshlovchilar uchun',
      details: 'Kam elementlar, ko\'p vaqt, 5 ta imkon'
    },
    {
      id: 'medium',
      name: 'O\'rta',
      icon: '🤔',
      description: 'Biroz qiyinroq',
      details: 'O\'rta elementlar, cheklangan vaqt, 3 ta imkon'
    },
    {
      id: 'hard',
      name: 'Qiyin',
      icon: '😤',
      description: 'Professionallar uchun',
      details: 'Ko\'p elementlar, kam vaqt, 2 ta imkon'
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
            ← Orqaga
          </button>
          <h2>🎮 O'yin Tanlang</h2>
          <p className="step-indicator">Qadam 1/2</p>
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
                  Tanlash ➡️
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="tips-section">
          <h3>💡 Maslahatlar:</h3>
          <ul>
            <li>Har bir o'yin turli ko'nikmalarni rivojlantiradi</li>
            <li>Boshlang'ichlar uchun Xotira Kartalari tavsiya etiladi</li>
            <li>Har kuni turli o'yinlarni o'ynab ko'ring</li>
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
          ← Orqaga
        </button>
        <h2>🎯 Daraja Tanlang</h2>
        <p className="step-indicator">Qadam 2/2</p>
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
        <h3>Qiyinlik darajasini tanlang:</h3>
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
                {selectedDifficulty === diff.id ? '✅ Tanlangan' : 'Tanlash'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="start-section">
        <button className="start-game-button" onClick={handleStartGame}>
          🚀 O'yinni Boshlash
        </button>
        <p className="game-start-hint">
          Tayyor bo'lganingizda "Boshlash" tugmasini bosing
        </p>
      </div>
    </div>
  )
}

export default GameSelector