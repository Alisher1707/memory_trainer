import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, scoreAPI, userAPI } from '../services/api'

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
    verifyToken()
  }, [])

  const verifyToken = async () => {
    const token = localStorage.getItem('authToken')
    const guestMode = localStorage.getItem('memoryTrainerGuest')

    if (token) {
      try {
        const response = await authAPI.verify()
        if (response.success) {
          setUser(response.user)
          setIsGuest(false)
        } else {
          localStorage.removeItem('authToken')
          localStorage.removeItem('memoryTrainerUser')
        }
      } catch (error) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('memoryTrainerUser')
      }
    } else if (guestMode) {
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
      setIsGuest(true)
      setUser(guestData)
    }

    setLoading(false)
  }

  const signup = async (email, password, name) => {
    try {
      const response = await authAPI.signup(email, password, name)

      if (response.success) {
        localStorage.setItem('authToken', response.token)
        localStorage.setItem('memoryTrainerUser', JSON.stringify(response.user))
        localStorage.removeItem('memoryTrainerGuest')
        setUser(response.user)
        setIsGuest(false)
        return { success: true, user: response.user }
      }

      return { success: false, error: 'Ro\'yxatdan o\'tishda xatolik' }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Server xatoligi'
      }
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)

      if (response.success) {
        localStorage.setItem('authToken', response.token)
        localStorage.setItem('memoryTrainerUser', JSON.stringify(response.user))
        localStorage.removeItem('memoryTrainerGuest')
        setUser(response.user)
        setIsGuest(false)
        return { success: true, user: response.user }
      }

      return { success: false, error: 'Kirish amalga oshmadi' }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Server xatoligi'
      }
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
    localStorage.removeItem('authToken')
    localStorage.removeItem('memoryTrainerUser')
    localStorage.removeItem('memoryTrainerGuest')
    setUser(null)
    setIsGuest(false)
  }

  const updateUserStats = async (gameType, score, difficulty, timeSpent, moves) => {
    if (!user) return

    // Mehmon uchun faqat local yangilanish
    if (isGuest) {
      const gameKey = `${gameType}_${difficulty}`
      const updatedUser = {
        ...user,
        stats: {
          ...user.stats,
          gamesPlayed: user.stats.gamesPlayed + 1,
          totalScore: user.stats.totalScore + score,
          bestScores: {
            ...user.stats.bestScores,
            [gameKey]: Math.max(user.stats.bestScores[gameKey] || 0, score)
          }
        }
      }
      setUser(updatedUser)
      return
    }

    // Serverga yuborish
    try {
      console.log('Natija yuborilmoqda:', { gameType, score, difficulty, timeSpent, moves })
      const response = await scoreAPI.submitScore(gameType, score, difficulty, timeSpent, moves)
      console.log('Server javobi:', response)

      if (response.success) {
        // Foydalanuvchi ma'lumotlarini yangilash
        const updatedStats = await userAPI.getStats(user._id)
        console.log('Yangilangan stats:', updatedStats)

        if (updatedStats.success) {
          const updatedUser = {
            ...user,
            stats: updatedStats.stats
          }
          setUser(updatedUser)
          localStorage.setItem('memoryTrainerUser', JSON.stringify(updatedUser))
        }

        // Yutuqlarni ko'rsatish
        if (response.newAchievements && response.newAchievements.length > 0) {
          console.log('Yangi yutuqlar:', response.newAchievements)
          // Bu yerda achievement notification ko'rsatish mumkin
        }
      }
    } catch (error) {
      console.error('Natija yuborishda xatolik:', error)
      console.error('Xatolik detallar:', error.response?.data)

      // Local fallback - agar server ishlamasa
      const gameKey = `${gameType}_${difficulty}`
      const updatedUser = {
        ...user,
        stats: {
          ...user.stats,
          gamesPlayed: user.stats.gamesPlayed + 1,
          totalScore: user.stats.totalScore + score,
          bestScores: {
            ...user.stats.bestScores,
            [gameKey]: Math.max(user.stats.bestScores?.[gameKey] || 0, score)
          },
          recentGames: [
            {
              gameType,
              score,
              difficulty,
              timeSpent,
              moves,
              timestamp: new Date().toISOString(),
              date: new Date().toDateString()
            },
            ...(user.stats.recentGames || []).slice(0, 19)
          ]
        }
      }
      setUser(updatedUser)
      localStorage.setItem('memoryTrainerUser', JSON.stringify(updatedUser))
      console.log('Local fallback ishlatildi')
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