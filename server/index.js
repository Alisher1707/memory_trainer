const express = require('express')
const cors = require('cors')
require('dotenv').config()

const connectDB = require('./config/database')
const securityConfig = require('./config/security')
const { devFormat, prodFormat, errorLogger } = require('./config/logger')
const { errorHandler, notFound } = require('./middleware/errorHandler')
const { apiLimiter } = require('./middleware/rateLimiter')

// Routes
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const scoreRoutes = require('./routes/scoreRoutes')
const leaderboardRoutes = require('./routes/leaderboardRoutes')
const statisticsRoutes = require('./routes/statisticsRoutes')

const app = express()
const PORT = process.env.PORT || 3001

// MongoDB ga ulanish
connectDB()

// Security middleware
securityConfig().forEach(middleware => app.use(middleware))

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logging
if (process.env.NODE_ENV === 'production') {
  app.use(prodFormat)
} else {
  app.use(devFormat)
}

// Rate limiting
app.use('/api', apiLimiter)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/scores', scoreRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/statistics', statisticsRoutes)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Memory Trainer API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login',
        verify: 'GET /api/auth/verify'
      },
      users: {
        profile: 'GET /api/users/:userId',
        update: 'PUT /api/users/:userId',
        password: 'PUT /api/users/:userId/password',
        stats: 'GET /api/users/:userId/stats',
        statistics: 'GET /api/users/:userId/statistics',
        achievements: 'GET /api/users/:userId/achievements',
        delete: 'DELETE /api/users/:userId'
      },
      scores: {
        submit: 'POST /api/scores',
        global: 'GET /api/scores/global',
        userScores: 'GET /api/scores/user/:userId'
      },
      leaderboard: {
        main: 'GET /api/leaderboard',
        topPlayers: 'GET /api/leaderboard/top-players',
        byGame: 'GET /api/leaderboard/by-game/:gameType',
        rank: 'GET /api/leaderboard/rank/:userId'
      },
      statistics: {
        global: 'GET /api/statistics/global',
        report: 'GET /api/statistics/report/:period',
        compare: 'GET /api/statistics/compare/:userId1/:userId2',
        activity: 'GET /api/statistics/activity/:userId'
      },
      health: 'GET /api/health'
    }
  })
})

// Error logging middleware
app.use(errorLogger)

// Error handling middlewares (oxirida bo'lishi kerak)
app.use(notFound)
app.use(errorHandler)

// Server ishga tushirish
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║     🚀 Memory Trainer Server                               ║
║                                                            ║
║     Port: ${PORT}                                        ║
║     Environment: ${process.env.NODE_ENV || 'development'}                             ║
║     MongoDB: ${process.env.MONGODB_URI ? 'Connected' : 'Using default'}                                  ║
║                                                            ║
║     📊 API Documentation: http://localhost:${PORT}         ║
║     🏥 Health Check: http://localhost:${PORT}/api/health   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})
