import React, { useState } from 'react'
import Button from '../ui/Button'
import { useLanguage } from '../../contexts/LanguageContext'

const LevelSelector = ({
  selectedLevel = 'easy',
  onLevelSelect,
  showPreview = true,
  compact = false
}) => {
  const { t } = useLanguage()
  const [hoveredLevel, setHoveredLevel] = useState(null)

  const levels = [
    {
      id: 'easy',
      name: t('games.easyName'),
      icon: '😊',
      description: t('games.easyDesc'),
      details: t('games.easyDetails'),
      color: '#4CAF50',
      stats: {
        elements: '4-6',
        time: t('games.unlimited'),
        lives: '5',
        multiplier: '1x'
      }
    },
    {
      id: 'medium',
      name: t('games.mediumName'),
      icon: '🤔',
      description: t('games.mediumDesc'),
      details: t('games.mediumDetails'),
      color: '#FF9800',
      stats: {
        elements: '6-8',
        time: `2 ${t('games.minute')}`,
        lives: '3',
        multiplier: '1.5x'
      }
    },
    {
      id: 'hard',
      name: t('games.hardName'),
      icon: '😤',
      description: t('games.hardDesc'),
      details: t('games.hardDetails'),
      color: '#F44336',
      stats: {
        elements: '8-12',
        time: `90 ${t('games.seconds')}`,
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
        <h3>🎯 {t('games.selectDifficultyLevel')}</h3>
        <p>{t('games.chooseLevel')}</p>
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
                <h4>{level.name} {t('games.level')}</h4>
                <p>{level.details}</p>
              </div>
              <div className="level-selector-radio">
                {selectedLevel === level.id ? '●' : '○'}
              </div>
            </div>

            <div className="level-challenge">
              <div className="challenge-item">
                <span className="challenge-label">{t('games.goal')}</span>
                <span className="challenge-value">
                  {level.stats.time === t('games.unlimited') ? t('games.findAllPairs') : `${t('games.findAllPairs')} ${level.stats.time}`}
                </span>
              </div>
              <div className="challenge-item">
                <span className="challenge-label">{t('games.reward')}</span>
                <span className="challenge-value">
                  {t('games.scoreMultiplied').replace('{multiplier}', level.stats.multiplier)}
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