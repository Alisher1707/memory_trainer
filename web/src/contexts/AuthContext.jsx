import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isGuest, setIsGuest] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('memoryTrainerUser')
    const guestMode = localStorage.getItem('memoryTrainerGuest')

    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else if (guestMode) {
      setIsGuest(true)
    }

    setLoading(false)
  }, [])

  const signup = async (email, password, name) => {
    try {
      // Bu yerda server bilan bog'lanish bo'ladi
      // Hozircha localStorage ishlatamiz
      const userData = {
        id: Date.now(),
        email,
        name,
        createdAt: new Date().toISOString(),
        stats: {
          gamesPlayed: 0,
          totalScore: 0,
          bestScores: {},
          achievements: []
        }
      }

      localStorage.setItem('memoryTrainerUser', JSON.stringify(userData))
      localStorage.removeItem('memoryTrainerGuest')
      setUser(userData)
      setIsGuest(false)

      return { success: true, user: userData }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const login = async (email, password) => {
    try {
      // Bu yerda server bilan bog'lanish bo'ladi
      const savedUser = localStorage.getItem('memoryTrainerUser')

      if (savedUser) {
        const userData = JSON.parse(savedUser)
        if (userData.email === email) {
          setUser(userData)
          setIsGuest(false)
          localStorage.removeItem('memoryTrainerGuest')
          return { success: true, user: userData }
        }
      }

      return { success: false, error: 'Foydalanuvchi topilmadi' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const loginAsGuest = () => {
    const guestData = {
      id: 'guest_' + Date.now(),
      name: 'Mehmon',
      isGuest: true,
      stats: {
        gamesPlayed: 0,
        totalScore: 0,
        bestScores: {},
        achievements: []
      }
    }

    localStorage.setItem('memoryTrainerGuest', 'true')
    localStorage.removeItem('memoryTrainerUser')
    setIsGuest(true)
    setUser(guestData)
  }

  const logout = () => {
    localStorage.removeItem('memoryTrainerUser')
    localStorage.removeItem('memoryTrainerGuest')
    setUser(null)
    setIsGuest(false)
  }

  const updateUserStats = (gameType, score, difficulty, timeSpent, moves) => {
    if (!user) return

    const gameKey = `${gameType}_${difficulty}`
    const gameResult = {
      score,
      difficulty,
      timeSpent,
      moves,
      timestamp: new Date().toISOString(),
      date: new Date().toDateString()
    }

    const updatedUser = {
      ...user,
      stats: {
        ...user.stats,
        gamesPlayed: user.stats.gamesPlayed + 1,
        totalScore: user.stats.totalScore + score,
        bestScores: {
          ...user.stats.bestScores,
          [gameKey]: Math.max(user.stats.bestScores[gameKey] || 0, score)
        },
        recentGames: [
          gameResult,
          ...(user.stats.recentGames || []).slice(0, 19)
        ],
        achievements: updateAchievements(user.stats, gameResult)
      }
    }

    setUser(updatedUser)

    if (!isGuest) {
      localStorage.setItem('memoryTrainerUser', JSON.stringify(updatedUser))
    }

    submitScoreToServer(gameResult)
  }

  const updateAchievements = (currentStats, gameResult) => {
    const achievements = [...(currentStats.achievements || [])]

    if (currentStats.gamesPlayed + 1 === 1 && !achievements.includes('first_game')) {
      achievements.push('first_game')
    }

    if (currentStats.gamesPlayed + 1 === 10 && !achievements.includes('veteran')) {
      achievements.push('veteran')
    }

    if (gameResult.score >= 1500 && !achievements.includes('high_scorer')) {
      achievements.push('high_scorer')
    }

    if (gameResult.difficulty === 'hard' && !achievements.includes('difficulty_master')) {
      achievements.push('difficulty_master')
    }

    return achievements
  }

  const submitScoreToServer = async (gameResult) => {
    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...gameResult
        })
      })

      if (response.ok) {
        console.log('Score submitted successfully')
      }
    } catch (error) {
      console.log('Score submission failed, storing locally')
      const localScores = JSON.parse(localStorage.getItem('pendingScores') || '[]')
      localScores.push({ userId: user.id, ...gameResult })
      localStorage.setItem('pendingScores', JSON.stringify(localScores))
    }
  }

  const value = {
    user,
    isGuest,
    loading,
    signup,
    login,
    loginAsGuest,
    logout,
    updateUserStats,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}