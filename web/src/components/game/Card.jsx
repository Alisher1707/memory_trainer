import React, { useState, useEffect } from 'react'

const Card = ({
  id,
  content,
  isFlipped = false,
  isMatched = false,
  isDisabled = false,
  onClick,
  animationDuration = 300,
  size = 'medium',
  theme = 'default'
}) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldShowContent, setShouldShowContent] = useState(isFlipped)

  useEffect(() => {
    if (isFlipped !== shouldShowContent && !isAnimating) {
      setIsAnimating(true)

      // Flip animation timing
      setTimeout(() => {
        setShouldShowContent(isFlipped)
      }, animationDuration / 2)

      setTimeout(() => {
        setIsAnimating(false)
      }, animationDuration)
    }
  }, [isFlipped, shouldShowContent, isAnimating, animationDuration])

  const handleClick = () => {
    if (isDisabled || isAnimating || isFlipped) return
    if (onClick) onClick(id)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  const sizeClasses = {
    small: 'card-sm',
    medium: 'card-md',
    large: 'card-lg'
  }

  const cardClasses = [
    'memory-card',
    sizeClasses[size],
    theme && `card-theme-${theme}`,
    isFlipped && 'flipped',
    isMatched && 'matched',
    isDisabled && 'disabled',
    isAnimating && 'animating'
  ].filter(Boolean).join(' ')

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={!isDisabled ? 0 : -1}
      role="button"
      aria-label={`Memory card ${id}${isFlipped ? `, showing ${content}` : ', face down'}`}
      aria-pressed={isFlipped}
      style={{
        '--animation-duration': `${animationDuration}ms`
      }}
    >
      <div className="card-inner">
        <div className="card-front">
          <div className="card-pattern">
            <div className="pattern-circle" />
            <div className="pattern-lines" />
          </div>
          <div className="card-logo">
            🧠
          </div>
        </div>

        <div className="card-back">
          <div className="card-content">
            {shouldShowContent && content}
          </div>
          {isMatched && (
            <div className="match-indicator">
              <span className="match-checkmark">✓</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover and focus effects */}
      <div className="card-effects">
        <div className="card-glow" />
        <div className="card-shine" />
      </div>

      {/* Match celebration effect */}
      {isMatched && (
        <div className="match-celebration">
          <div className="celebration-particle" style={{ '--delay': '0ms' }} />
          <div className="celebration-particle" style={{ '--delay': '100ms' }} />
          <div className="celebration-particle" style={{ '--delay': '200ms' }} />
        </div>
      )}
    </div>
  )
}

export default Card