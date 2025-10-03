const express = require('express')
const router = express.Router()
const Score = require('../models/Score')
const User = require('../models/User')
const { optionalAuth } = require('../middleware/auth')

// Leaderboard - eng yaxshi natijalar
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { gameType, difficulty, limit = 100, period } = req.query

    const filter = {}
    if (gameType) filter.gameType = gameType
    if (difficulty) filter.difficulty = difficulty

    // Vaqt filtri
    if (period) {
      const startDate = new Date()
      switch(period) {
        case 'day':
          startDate.setDate(startDate.getDate() - 1)
          break
        case 'week':
          startDate.setDate(startDate.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1)
          break
      }
      filter.timestamp = { $gte: startDate }
    }

    const leaderboard = await Score.find(filter)
      .sort({ score: -1, timestamp: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'name')
      .lean()

    const formattedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      userName: entry.userId?.name || 'Anonim',
      userId: entry.userId?._id,
      score: entry.score,
      gameType: entry.gameType,
      difficulty: entry.difficulty,
      timeSpent: entry.timeSpent,
      date: entry.date,
      timestamp: entry.timestamp
    }))

    res.json({ success: true, leaderboard: formattedLeaderboard })
  } catch (error) {
    next(error)
  }
})

// Top o'yinchilar (umumiy ball bo'yicha)
router.get('/top-players', optionalAuth, async (req, res, next) => {
  try {
    const { limit = 10 } = req.query

    const topPlayers = await User.find()
      .select('name stats.totalScore stats.gamesPlayed stats.achievements')
      .sort({ 'stats.totalScore': -1 })
      .limit(parseInt(limit))
      .lean()

    const formattedPlayers = topPlayers.map((player, index) => ({
      rank: index + 1,
      userId: player._id,
      name: player.name,
      totalScore: player.stats.totalScore,
      gamesPlayed: player.stats.gamesPlayed,
      achievements: player.stats.achievements?.length || 0
    }))

    res.json({ success: true, topPlayers: formattedPlayers })
  } catch (error) {
    next(error)
  }
})

// O'yin turi bo'yicha top players
router.get('/by-game/:gameType', optionalAuth, async (req, res, next) => {
  try {
    const { gameType } = req.params
    const { difficulty, limit = 50 } = req.query

    const filter = { gameType }
    if (difficulty) filter.difficulty = difficulty

    // Har bir foydalanuvchi uchun eng yaxshi natijani olish
    const topScores = await Score.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$userId',
          bestScore: { $max: '$score' },
          totalGames: { $sum: 1 }
        }
      },
      { $sort: { bestScore: -1 } },
      { $limit: parseInt(limit) }
    ])

    // Foydalanuvchi ma'lumotlarini qo'shish
    const userIds = topScores.map(s => s._id)
    const users = await User.find({ _id: { $in: userIds } }).select('name').lean()
    const userMap = new Map(users.map(u => [u._id.toString(), u.name]))

    const formattedLeaderboard = topScores.map((entry, index) => ({
      rank: index + 1,
      userId: entry._id,
      userName: userMap.get(entry._id.toString()) || 'Anonim',
      bestScore: entry.bestScore,
      totalGames: entry.totalGames
    }))

    res.json({ success: true, leaderboard: formattedLeaderboard, gameType, difficulty })
  } catch (error) {
    next(error)
  }
})

// Foydalanuvchining leaderboard dagi o'rni
router.get('/rank/:userId', optionalAuth, async (req, res, next) => {
  try {
    const { userId } = req.params
    const { gameType, difficulty } = req.query

    const user = await User.findById(userId).select('name stats.totalScore').lean()
    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' })
    }

    // Umumiy reyting
    const overallRank = await User.countDocuments({
      'stats.totalScore': { $gt: user.stats.totalScore }
    }) + 1

    let gameRank = null

    // O'yin turi bo'yicha reyting
    if (gameType) {
      const filter = { gameType, userId }
      if (difficulty) filter.difficulty = difficulty

      const userBestScore = await Score.findOne(filter)
        .sort({ score: -1 })
        .lean()

      if (userBestScore) {
        const betterScoresCount = await Score.countDocuments({
          gameType,
          difficulty: difficulty || userBestScore.difficulty,
          score: { $gt: userBestScore.score }
        })

        gameRank = {
          rank: betterScoresCount + 1,
          score: userBestScore.score,
          gameType,
          difficulty: difficulty || userBestScore.difficulty
        }
      }
    }

    res.json({
      success: true,
      userName: user.name,
      overallRank,
      totalScore: user.stats.totalScore,
      gameRank
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
