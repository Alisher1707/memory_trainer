import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'

const Timer = ({
  isRunning = false,
  initialTime = 0,
  timeLimit = null,
  onTimeUpdate,
  onTimeUp,
  format = 'mm:ss',
  showWarning = true,
  warningThreshold = 30
}) => {
  const { t } = useLanguage()
  const [time, setTime] = useState(initialTime)
  const [isWarning, setIsWarning] = useState(false)

  useEffect(() => {
    setTime(initialTime)
  }, [initialTime])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTime(prevTime => {
        const newTime = timeLimit ? prevTime - 1 : prevTime + 1

        // Check for warning state
        if (timeLimit && showWarning && newTime <= warningThreshold && newTime > 0) {
          setIsWarning(true)
        } else {
          setIsWarning(false)
        }

        // Check for time up
        if (timeLimit && newTime <= 0) {
          if (onTimeUp) onTimeUp()
          return 0
        }

        // Call update callback
        if (onTimeUpdate) onTimeUpdate(newTime)

        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, timeLimit, onTimeUpdate, onTimeUp, showWarning, warningThreshold])

  const formatTime = (seconds) => {
    const mins = Math.floor(Math.abs(seconds) / 60)
    const secs = Math.abs(seconds) % 60

    switch (format) {
      case 'mm:ss':
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      case 'm:ss':
        return `${mins}:${secs.toString().padStart(2, '0')}`
      case 'ss':
        return secs.toString()
      case 'human':
        if (mins > 0) {
          return `${mins}m ${secs}s`
        }
        return `${secs}s`
      default:
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
  }

  const getTimerClass = () => {
    const baseClass = 'timer'
    const classes = [baseClass]

    if (timeLimit) {
      classes.push('timer-countdown')
      if (isWarning) classes.push('timer-warning')
      if (time <= 0) classes.push('timer-expired')
    } else {
      classes.push('timer-stopwatch')
    }

    return classes.join(' ')
  }

  const getProgressPercentage = () => {
    if (!timeLimit) return 0
    return Math.max(0, (time / timeLimit) * 100)
  }

  return (
    <div className={getTimerClass()}>
      <div className="timer-container">
        {timeLimit && (
          <div className="timer-progress">
            <div
              className="timer-progress-bar"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        )}

        <div className="timer-display">
          <span className="timer-icon">
            {timeLimit ? '⏰' : '⏱️'}
          </span>
          <span className="timer-text">
            {formatTime(time)}
          </span>
        </div>

        {timeLimit && (
          <div className="timer-info">
            <span className="timer-label">
              {time > 0 ? t('game.timeRemaining') : t('game.timeUp')}
            </span>
          </div>
        )}
      </div>

      {isWarning && (
        <div className="timer-warning-pulse" />
      )}
    </div>
  )
}

export default Timer