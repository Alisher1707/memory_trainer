import React, { useState } from 'react'
import Button from '../ui/Button'

const LevelSelector = ({
  selectedLevel = 'easy',
  onLevelSelect,
  showPreview = true,
  compact = false
}) => {
  const [hoveredLevel, setHoveredLevel] = useState(null)

  const levels = [
    {
      id: 'easy',
      name: 'Oson',
      icon: '😊',
      description: 'Yangi boshlovchilar uchun',
      details: 'Kam elementlar, ko\'p vaqt, 5 ta imkon',
      color: '#4CAF50',
      stats: {
        elements: '4-6',
        time: 'Cheksiz',
        lives: '5',
        multiplier: '1x'
      }
    },
    {
      id: 'medium',
      name: 'O\'rta',
      icon: '🤔',
      description: 'Biroz qiyinroq',
      details: 'O\'rta elementlar, cheklangan vaqt, 3 ta imkon',
      color: '#FF9800',
      stats: {
        elements: '6-8',
        time: '2 daqiqa',
        lives: '3',
        multiplier: '1.5x'
      }
    },
    {
      id: 'hard',
      name: 'Qiyin',
      icon: '😤',
      description: 'Professionallar uchun',
      details: 'Ko\'p elementlar, kam vaqt, 2 ta imkon',
      color: '#F44336',
      stats: {
        elements: '8-12',
        time: '90 soniya',
        lives: '2',
        multiplier: '2x'
      }
    }
  ]

  const currentLevel = levels.find(level => level.id === selectedLevel)
  const previewLevel = hoveredLevel ? levels.find(level => level.id === hoveredLevel) : currentLevel

  if (compact) {
    return (
      <div className="level-selector-compact">
        <div className="level-buttons">
          {levels.map((level) => (
            <Button
              key={level.id}
              variant={selectedLevel === level.id ? 'primary' : 'outline'}
              size="small"
              onClick={() => onLevelSelect(level.id)}
              icon={level.icon}
              className="level-button-compact"
            >
              {level.name}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="level-selector">
      <div className="level-selector-header">
        <h3>🎯 Qiyinlik Darajasini Tanlang</h3>
        <p>Sizning tajribangizga mos darajani tanlang</p>
      </div>

      <div className="level-options">
        {levels.map((level) => (
          <div
            key={level.id}
            className={`level-option ${selectedLevel === level.id ? 'selected' : ''}`}
            onClick={() => onLevelSelect(level.id)}
            style={{ '--level-color': level.color }}
          >
            <div className="level-header">
              <div className="level-icon">{level.icon}</div>
              <div className="level-info">
                <h4>{level.name} daraja</h4>
                <p>{level.details}</p>
              </div>
              <div className="level-selector-radio">
                {selectedLevel === level.id ? '●' : '○'}
              </div>
            </div>

            <div className="level-challenge">
              <div className="challenge-item">
                <span className="challenge-label">Maqsad:</span>
                <span className="challenge-value">
                  Barcha juftlarni {level.stats.time === 'Cheksiz' ? 'toping' : `${level.stats.time} ichida toping`}
                </span>
              </div>
              <div className="challenge-item">
                <span className="challenge-label">Mukofot:</span>
                <span className="challenge-value">
                  Ball {level.stats.multiplier} ko'paytiriladi
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LevelSelector