import React, { useState, useEffect } from 'react'

const ScoreCounter = ({
  score = 0,
  bestScore = 0,
  showBest = true,
  showIncrease = true,
  animateChanges = true,
  size = 'medium'
}) => {
  const [displayScore, setDisplayScore] = useState(score)
  const [isIncreasing, setIsIncreasing] = useState(false)
  const [scoreIncrease, setScoreIncrease] = useState(0)

  useEffect(() => {
    if (!animateChanges) {
      setDisplayScore(score)
      return
    }

    if (score > displayScore) {
      const increase = score - displayScore
      setScoreIncrease(increase)
      setIsIncreasing(true)

      // Animate score increment
      const startScore = displayScore
      const targetScore = score
      const duration = 800
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentScore = Math.round(startScore + (targetScore - startScore) * easeOutQuart)

        setDisplayScore(currentScore)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsIncreasing(false)
        }
      }

      requestAnimationFrame(animate)
    } else {
      setDisplayScore(score)
    }
  }, [score, displayScore, animateChanges])

  const sizeClasses = {
    small: 'score-counter-sm',
    medium: 'score-counter-md',
    large: 'score-counter-lg'
  }

  const formatScore = (num) => {
    return num.toLocaleString('uz-UZ')
  }

  const getScoreRating = (currentScore) => {
    if (currentScore >= 2000) return { emoji: '🔥', color: '#ff6b6b', label: 'Ajoyib!' }
    if (currentScore >= 1500) return { emoji: '⭐', color: '#feca57', label: 'Yaxshi!' }
    if (currentScore >= 1000) return { emoji: '👍', color: '#48dbfb', label: 'Zo\'r!' }
    if (currentScore >= 500) return { emoji: '😊', color: '#1dd1a1', label: 'Yaxshi!' }
    return { emoji: '💪', color: '#a55eea', label: 'Davom eting!' }
  }

  const rating = getScoreRating(displayScore)
  const isNewBest = showBest && displayScore > bestScore && bestScore > 0

  return (
    <div className={`score-counter ${sizeClasses[size]} ${isIncreasing ? 'animating' : ''}`}>
      <div className="score-main">
        <div className="score-icon" style={{ color: rating.color }}>
          {rating.emoji}
        </div>

        <div className="score-content">
          <div className="score-value">
            <span className="score-number">{formatScore(displayScore)}</span>
            <span className="score-label">ball</span>
          </div>

          <div className="score-rating" style={{ color: rating.color }}>
            {rating.label}
          </div>
        </div>

        {isIncreasing && showIncrease && (
          <div className="score-increase">
            +{formatScore(scoreIncrease)}
          </div>
        )}
      </div>

      {showBest && bestScore > 0 && (
        <div className="score-best">
          <div className="best-label">
            {isNewBest ? (
              <span className="new-best">🏆 Yangi rekord!</span>
            ) : (
              <span className="best-normal">📊 Eng yaxshi:</span>
            )}
          </div>
          <div className="best-value">
            {formatScore(isNewBest ? displayScore : bestScore)}
          </div>
        </div>
      )}

      <div className="score-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${Math.min((displayScore / 2000) * 100, 100)}%`,
              backgroundColor: rating.color
            }}
          />
        </div>
        <div className="progress-labels">
          <span>0</span>
          <span>2000+</span>
        </div>
      </div>
    </div>
  )
}

export default ScoreCounter