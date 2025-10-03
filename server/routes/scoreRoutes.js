const express = require('express')
const router = express.Router()
const Score = require('../models/Score')
const User = require('../models/User')
const { authenticateToken, optionalAuth } = require('../middleware/auth')
const { validateScore } = require('../middleware/validator')
const { scoreLimiter } = require('../middleware/rateLimiter')
const AchievementService = require('../services/achievementService')

// Score yuborish
router.post('/', authenticateToken, scoreLimiter, validateScore, async (req, res, next) => {
  try {
    const { gameType, score, difficulty, timeSpent, moves } = req.body
    const userId = req.user.userId

    const scoreEntry = await Score.create({
      userId,
      gameType,
      score,
      difficulty,
      timeSpent: timeSpent || 0,
      moves: moves || 0,
      timestamp: new Date(),
      date: new Date().toDateString()
    })

    // Update user stats
    const user = await User.findById(userId)
    if (user) {
      const gameKey = `${gameType}_${difficulty}`

      // Yutuqlarni tekshirish (yangilanishdan oldin)
      const newAchievements = AchievementService.checkAchievements(user, {
        gameType,
        score,
        difficulty,
        timeSpent,
        moves
      })

      // Statistikani yangilash
      user.stats.gamesPlayed += 1
      user.stats.totalScore += score

      const currentBest = user.stats.bestScores.get(gameKey) || 0
      user.stats.bestScores.set(gameKey, Math.max(currentBest, score))

      user.stats.recentGames = [
        {
          gameType,
          score,
          difficulty,
          timeSpent,
          moves,
          timestamp: new Date(),
          date: new Date().toDateString()
        },
        ...(user.stats.recentGames || []).slice(0, 19)
      ]

      // Yangi yutuqlarni qo'shish
      if (newAchievements.length > 0) {
        const achievementIds = newAchievements.map(a => a.id)
        user.stats.achievements = [
          ...(user.stats.achievements || []),
          ...achievementIds
        ]
      }

      await user.save()

      // Yutuqlar bilan javob qaytarish
      res.json({
        success: true,
        scoreEntry,
        newAchievements: newAchievements.length > 0 ? newAchievements : undefined
      })
    } else {
      res.json({ success: true, scoreEntry })
    }
  } catch (error) {
    next(error)
  }
})

// Global natijalar
router.get('/global', optionalAuth, async (req, res, next) => {
  try {
    const { gameType, difficulty, limit = 10 } = req.query

    const filter = {}
    if (gameType) filter.gameType = gameType
    if (difficulty) filter.difficulty = difficulty

    const topScores = await Score.find(filter)
      .sort({ score: -1, timestamp: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'name')
      .lean()

    const formattedScores = topScores.map((score, index) => ({
      rank: index + 1,
      ...score,
      userName: score.userId?.name || 'Anonim'
    }))

    res.json({ success: true, scores: formattedScores })
  } catch (error) {
    next(error)
  }
})

// Foydalanuvchi natijalari
router.get('/user/:userId', authenticateToken, async (req, res, next) => {
  try {
    const { userId } = req.params
    const { limit = 20, gameType, difficulty } = req.query

    const filter = { userId }
    if (gameType) filter.gameType = gameType
    if (difficulty) filter.difficulty = difficulty

    const userScores = await Score.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .lean()

    res.json({ success: true, scores: userScores })
  } catch (error) {
    next(error)
  }
})

module.exports = router
