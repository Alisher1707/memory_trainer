import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Axios instance yaratish
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - har bir so'rovga token qo'shish
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - xatolarni boshqarish
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token muddati tugagan
      localStorage.removeItem('authToken')
      localStorage.removeItem('memoryTrainerUser')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  signup: async (email, password, name) => {
    const response = await api.post('/auth/signup', { email, password, name })
    return response.data
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  verify: async () => {
    const response = await api.get('/auth/verify')
    return response.data
  }
}

// User API
export const userAPI = {
  getProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`)
    return response.data
  },

  updateProfile: async (userId, data) => {
    const response = await api.put(`/users/${userId}`, data)
    return response.data
  },

  changePassword: async (userId, currentPassword, newPassword) => {
    const response = await api.put(`/users/${userId}/password`, {
      currentPassword,
      newPassword
    })
    return response.data
  },

  getStats: async (userId) => {
    const response = await api.get(`/users/${userId}/stats`)
    return response.data
  },

  getStatistics: async (userId) => {
    const response = await api.get(`/users/${userId}/statistics`)
    return response.data
  },

  getAchievements: async (userId) => {
    const response = await api.get(`/users/${userId}/achievements`)
    return response.data
  },

  deleteAccount: async (userId) => {
    const response = await api.delete(`/users/${userId}`)
    return response.data
  }
}

// Score API
export const scoreAPI = {
  submitScore: async (gameType, score, difficulty, timeSpent, moves) => {
    const response = await api.post('/scores', {
      gameType,
      score,
      difficulty,
      timeSpent,
      moves
    })
    return response.data
  },

  getGlobalScores: async (gameType, difficulty, limit = 10) => {
    const params = {}
    if (gameType) params.gameType = gameType
    if (difficulty) params.difficulty = difficulty
    if (limit) params.limit = limit

    const response = await api.get('/scores/global', { params })
    return response.data
  },

  getUserScores: async (userId, limit = 20, gameType, difficulty) => {
    const params = { limit }
    if (gameType) params.gameType = gameType
    if (difficulty) params.difficulty = difficulty

    const response = await api.get(`/scores/user/${userId}`, { params })
    return response.data
  }
}

// Leaderboard API
export const leaderboardAPI = {
  getLeaderboard: async (gameType, difficulty, limit = 100, period) => {
    const params = {}
    if (gameType) params.gameType = gameType
    if (difficulty) params.difficulty = difficulty
    if (limit) params.limit = limit
    if (period) params.period = period

    const response = await api.get('/leaderboard', { params })
    return response.data
  },

  getTopPlayers: async (limit = 10) => {
    const response = await api.get('/leaderboard/top-players', { params: { limit } })
    return response.data
  },

  getByGame: async (gameType, difficulty, limit = 50) => {
    const params = {}
    if (difficulty) params.difficulty = difficulty
    if (limit) params.limit = limit

    const response = await api.get(`/leaderboard/by-game/${gameType}`, { params })
    return response.data
  },

  getUserRank: async (userId, gameType, difficulty) => {
    const params = {}
    if (gameType) params.gameType = gameType
    if (difficulty) params.difficulty = difficulty

    const response = await api.get(`/leaderboard/rank/${userId}`, { params })
    return response.data
  }
}

// Statistics API
export const statisticsAPI = {
  getGlobal: async () => {
    const response = await api.get('/statistics/global')
    return response.data
  },

  getReport: async (period = 'week') => {
    const response = await api.get(`/statistics/report/${period}`)
    return response.data
  },

  compareUsers: async (userId1, userId2) => {
    const response = await api.get(`/statistics/compare/${userId1}/${userId2}`)
    return response.data
  },

  getActivity: async (userId, days = 7) => {
    const response = await api.get(`/statistics/activity/${userId}`, {
      params: { days }
    })
    return response.data
  }
}

export default api
