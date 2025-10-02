const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// In-memory storage (in production, use a real database like MongoDB)
let users = []
let scores = []
let globalHighscores = []

// Helper functions
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'memory_trainer_secret', { expiresIn: '7d' })
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, process.env.JWT_SECRET || 'memory_trainer_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' })
    }
    req.user = user
    next()
  })
}

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = {
      id: Date.now().toString(),
      email,
      name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      stats: {
        gamesPlayed: 0,
        totalScore: 0,
        bestScores: {},
        achievements: [],
        recentGames: []
      }
    }

    users.push(user)

    const token = generateToken(user.id)
    const { password: _, ...userResponse } = user

    res.status(201).json({
      success: true,
      user: userResponse,
      token
    })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = users.find(u => u.email === email)
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    const token = generateToken(user.id)
    const { password: _, ...userResponse } = user

    res.json({
      success: true,
      user: userResponse,
      token
    })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Score Routes
app.post('/api/scores', authenticateToken, (req, res) => {
  try {
    const { gameType, score, difficulty, timeSpent, moves } = req.body
    const userId = req.user.userId

    const scoreEntry = {
      id: Date.now().toString(),
      userId,
      gameType,
      score,
      difficulty,
      timeSpent,
      moves,
      timestamp: new Date().toISOString(),
      date: new Date().toDateString()
    }

    scores.push(scoreEntry)

    // Update user stats
    const user = users.find(u => u.id === userId)
    if (user) {
      const gameKey = `${gameType}_${difficulty}`
      user.stats.gamesPlayed += 1
      user.stats.totalScore += score
      user.stats.bestScores[gameKey] = Math.max(user.stats.bestScores[gameKey] || 0, score)
      user.stats.recentGames = [scoreEntry, ...(user.stats.recentGames || []).slice(0, 19)]
    }

    // Update global highscores
    updateGlobalHighscores(scoreEntry)

    res.json({ success: true, scoreEntry })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/scores/global', (req, res) => {
  try {
    const { gameType, difficulty, limit = 10 } = req.query

    let filteredScores = scores
    if (gameType) {
      filteredScores = filteredScores.filter(s => s.gameType === gameType)
    }
    if (difficulty) {
      filteredScores = filteredScores.filter(s => s.difficulty === difficulty)
    }

    const topScores = filteredScores
      .sort((a, b) => b.score - a.score)
      .slice(0, parseInt(limit))
      .map(score => {
        const user = users.find(u => u.id === score.userId)
        return {
          ...score,
          userName: user ? user.name : 'Anonymous'
        }
      })

    res.json({ success: true, scores: topScores })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/scores/user/:userId', authenticateToken, (req, res) => {
  try {
    const { userId } = req.params
    const { limit = 20 } = req.query

    const userScores = scores
      .filter(s => s.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, parseInt(limit))

    res.json({ success: true, scores: userScores })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

// User Stats Routes
app.get('/api/users/:userId/stats', authenticateToken, (req, res) => {
  try {
    const { userId } = req.params
    const user = users.find(u => u.id === userId)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ success: true, stats: user.stats })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Friends/Social Features (placeholder)
app.get('/api/friends/:userId', authenticateToken, (req, res) => {
  try {
    // Placeholder for friends functionality
    res.json({ success: true, friends: [] })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Helper function to update global highscores
const updateGlobalHighscores = (scoreEntry) => {
  const key = `${scoreEntry.gameType}_${scoreEntry.difficulty}`

  if (!globalHighscores[key]) {
    globalHighscores[key] = []
  }

  globalHighscores[key].push(scoreEntry)
  globalHighscores[key] = globalHighscores[key]
    .sort((a, b) => b.score - a.score)
    .slice(0, 100) // Keep top 100 scores
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🚀 Memory Trainer Server running on port ${PORT}`)
  console.log(`📊 API endpoints:`)
  console.log(`   POST /api/auth/signup - User registration`)
  console.log(`   POST /api/auth/login - User login`)
  console.log(`   POST /api/scores - Submit score`)
  console.log(`   GET /api/scores/global - Global highscores`)
  console.log(`   GET /api/health - Health check`)
})