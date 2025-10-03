const Score = require('../models/Score')
const User = require('../models/User')

class StatisticsService {
  // Foydalanuvchi statistikasi
  static async getUserStatistics(userId) {
    const user = await User.findById(userId).lean()
    if (!user) {
      throw new Error('Foydalanuvchi topilmadi')
    }

    const scores = await Score.find({ userId }).lean()

    // O'yin turlari bo'yicha statistika
    const gameTypeStats = {}
    scores.forEach(score => {
      if (!gameTypeStats[score.gameType]) {
        gameTypeStats[score.gameType] = {
          played: 0,
          totalScore: 0,
          avgScore: 0,
          bestScore: 0,
          totalTime: 0,
          avgTime: 0
        }
      }

      const stats = gameTypeStats[score.gameType]
      stats.played += 1
      stats.totalScore += score.score
      stats.bestScore = Math.max(stats.bestScore, score.score)
      stats.totalTime += score.timeSpent || 0
    })

    // O'rtacha qiymatlarni hisoblash
    Object.keys(gameTypeStats).forEach(gameType => {
      const stats = gameTypeStats[gameType]
      stats.avgScore = Math.round(stats.totalScore / stats.played)
      stats.avgTime = Math.round(stats.totalTime / stats.played)
    })

    // Qiyinlik darajasi bo'yicha statistika
    const difficultyStats = {}
    scores.forEach(score => {
      if (!difficultyStats[score.difficulty]) {
        difficultyStats[score.difficulty] = {
          played: 0,
          totalScore: 0,
          avgScore: 0,
          bestScore: 0
        }
      }

      const stats = difficultyStats[score.difficulty]
      stats.played += 1
      stats.totalScore += score.score
      stats.bestScore = Math.max(stats.bestScore, score.score)
    })

    Object.keys(difficultyStats).forEach(difficulty => {
      const stats = difficultyStats[difficulty]
      stats.avgScore = Math.round(stats.totalScore / stats.played)
    })

    // Oxirgi 7 kunlik faollik
    const last7Days = await this.getRecentActivity(userId, 7)

    // Eng yaxshi natijalar
    const topScores = await Score.find({ userId })
      .sort({ score: -1 })
      .limit(10)
      .lean()

    return {
      overview: {
        gamesPlayed: user.stats.gamesPlayed,
        totalScore: user.stats.totalScore,
        avgScore: user.stats.gamesPlayed > 0
          ? Math.round(user.stats.totalScore / user.stats.gamesPlayed)
          : 0,
        achievements: user.stats.achievements?.length || 0
      },
      gameTypeStats,
      difficultyStats,
      recentActivity: last7Days,
      topScores
    }
  }

  // So'nggi faollik
  static async getRecentActivity(userId, days = 7) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const scores = await Score.find({
      userId,
      timestamp: { $gte: startDate }
    }).lean()

    const activityByDay = {}
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toDateString()
      activityByDay[dateStr] = {
        date: dateStr,
        games: 0,
        totalScore: 0,
        avgScore: 0
      }
    }

    scores.forEach(score => {
      const dateStr = score.date
      if (activityByDay[dateStr]) {
        activityByDay[dateStr].games += 1
        activityByDay[dateStr].totalScore += score.score
      }
    })

    Object.keys(activityByDay).forEach(date => {
      const activity = activityByDay[date]
      if (activity.games > 0) {
        activity.avgScore = Math.round(activity.totalScore / activity.games)
      }
    })

    return Object.values(activityByDay).reverse()
  }

  // Global statistika
  static async getGlobalStatistics() {
    const totalUsers = await User.countDocuments()
    const totalGames = await Score.countDocuments()

    const topPlayers = await User.find()
      .select('name stats.totalScore stats.gamesPlayed')
      .sort({ 'stats.totalScore': -1 })
      .limit(10)
      .lean()

    const recentGames = await Score.find()
      .populate('userId', 'name')
      .sort({ timestamp: -1 })
      .limit(20)
      .lean()

    // O'yin turlari bo'yicha umumiy statistika
    const gameTypeDistribution = await Score.aggregate([
      {
        $group: {
          _id: '$gameType',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' },
          maxScore: { $max: '$score' }
        }
      }
    ])

    // Qiyinlik darajasi taqsimoti
    const difficultyDistribution = await Score.aggregate([
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' }
        }
      }
    ])

    return {
      totalUsers,
      totalGames,
      avgGamesPerUser: totalUsers > 0 ? Math.round(totalGames / totalUsers) : 0,
      topPlayers: topPlayers.map((player, index) => ({
        rank: index + 1,
        name: player.name,
        totalScore: player.stats.totalScore,
        gamesPlayed: player.stats.gamesPlayed
      })),
      recentGames: recentGames.map(game => ({
        userName: game.userId?.name || 'Anonim',
        gameType: game.gameType,
        score: game.score,
        difficulty: game.difficulty,
        timestamp: game.timestamp
      })),
      gameTypeDistribution,
      difficultyDistribution
    }
  }

  // Taqqoslash - ikki foydalanuvchini solishtirish
  static async compareUsers(userId1, userId2) {
    const [user1Stats, user2Stats] = await Promise.all([
      this.getUserStatistics(userId1),
      this.getUserStatistics(userId2)
    ])

    const [user1, user2] = await Promise.all([
      User.findById(userId1).select('name').lean(),
      User.findById(userId2).select('name').lean()
    ])

    return {
      user1: {
        name: user1.name,
        stats: user1Stats.overview
      },
      user2: {
        name: user2.name,
        stats: user2Stats.overview
      },
      comparison: {
        gamesPlayedDiff: user1Stats.overview.gamesPlayed - user2Stats.overview.gamesPlayed,
        totalScoreDiff: user1Stats.overview.totalScore - user2Stats.overview.totalScore,
        avgScoreDiff: user1Stats.overview.avgScore - user2Stats.overview.avgScore,
        achievementsDiff: user1Stats.overview.achievements - user2Stats.overview.achievements
      }
    }
  }

  // Davriy hisobot (kunlik, haftalik, oylik)
  static async getPeriodicReport(period = 'week') {
    let startDate = new Date()

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
      default:
        startDate.setDate(startDate.getDate() - 7)
    }

    const scores = await Score.find({
      timestamp: { $gte: startDate }
    }).populate('userId', 'name').lean()

    const uniquePlayers = new Set(scores.map(s => s.userId?._id?.toString())).size
    const totalGames = scores.length
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0)
    const avgScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0

    const topScorer = scores.reduce((max, s) =>
      s.score > (max?.score || 0) ? s : max, null
    )

    return {
      period,
      startDate,
      endDate: new Date(),
      stats: {
        uniquePlayers,
        totalGames,
        totalScore,
        avgScore,
        topScore: topScorer ? {
          score: topScorer.score,
          player: topScorer.userId?.name || 'Anonim',
          gameType: topScorer.gameType,
          difficulty: topScorer.difficulty
        } : null
      }
    }
  }
}

module.exports = StatisticsService
