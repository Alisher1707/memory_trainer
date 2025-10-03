// Achievement definitions
const ACHIEVEMENTS = {
  first_game: {
    id: 'first_game',
    name: 'Birinchi qadam',
    description: 'Birinchi o\'yiningizni o\'ynang',
    icon: '🎮',
    points: 10
  },
  games_5: {
    id: 'games_5',
    name: 'Boshlang\'ich',
    description: '5 ta o\'yin o\'ynang',
    icon: '🌟',
    points: 25
  },
  games_10: {
    id: 'games_10',
    name: 'Tajribali',
    description: '10 ta o\'yin o\'ynang',
    icon: '⭐',
    points: 50
  },
  games_50: {
    id: 'games_50',
    name: 'Veteran',
    description: '50 ta o\'yin o\'ynang',
    icon: '🏆',
    points: 100
  },
  games_100: {
    id: 'games_100',
    name: 'Master',
    description: '100 ta o\'yin o\'ynang',
    icon: '👑',
    points: 250
  },
  score_500: {
    id: 'score_500',
    name: 'Yaxshi boshlanish',
    description: 'Bir o\'yinda 500 ball to\'plang',
    icon: '💯',
    points: 20
  },
  score_1000: {
    id: 'score_1000',
    name: 'Yuqori natija',
    description: 'Bir o\'yinda 1000 ball to\'plang',
    icon: '🎯',
    points: 50
  },
  score_1500: {
    id: 'score_1500',
    name: 'Mutaxassis',
    description: 'Bir o\'yinda 1500 ball to\'plang',
    icon: '🚀',
    points: 100
  },
  total_score_5000: {
    id: 'total_score_5000',
    name: 'Yig\'uvchi',
    description: 'Jami 5000 ball to\'plang',
    icon: '💰',
    points: 75
  },
  total_score_10000: {
    id: 'total_score_10000',
    name: 'Katta yig\'uvchi',
    description: 'Jami 10000 ball to\'plang',
    icon: '💎',
    points: 150
  },
  difficulty_easy: {
    id: 'difficulty_easy',
    name: 'Oson start',
    description: 'Easy rejimda o\'ynang',
    icon: '🟢',
    points: 5
  },
  difficulty_medium: {
    id: 'difficulty_medium',
    name: 'O\'rtacha qiyinlik',
    description: 'Medium rejimda o\'ynang',
    icon: '🟡',
    points: 15
  },
  difficulty_hard: {
    id: 'difficulty_hard',
    name: 'Qiyinchilik majburi',
    description: 'Hard rejimda o\'ynang',
    icon: '🔴',
    points: 30
  },
  all_games: {
    id: 'all_games',
    name: 'Har tomonlama',
    description: 'Barcha o\'yin turlarida o\'ynang',
    icon: '🎨',
    points: 50
  },
  speed_demon: {
    id: 'speed_demon',
    name: 'Tez chaqmoq',
    description: '30 soniyadan kamroq vaqtda o\'yinni tugatish',
    icon: '⚡',
    points: 40
  },
  perfect_memory: {
    id: 'perfect_memory',
    name: 'Mukammal xotira',
    description: 'Bir xatosiz o\'yinni tugatish',
    icon: '🧠',
    points: 75
  },
  daily_player: {
    id: 'daily_player',
    name: 'Kunlik o\'yinchi',
    description: '7 kun ketma-ket o\'ynang',
    icon: '📅',
    points: 100
  },
  top_10: {
    id: 'top_10',
    name: 'Top 10',
    description: 'Leaderboard da top 10 ga kiring',
    icon: '🏅',
    points: 150
  }
}

class AchievementService {
  // Yutuqlarni tekshirish
  static checkAchievements(user, gameResult) {
    const newAchievements = []
    const currentAchievements = user.stats.achievements || []

    // Birinchi o'yin
    if (user.stats.gamesPlayed === 0 && !currentAchievements.includes('first_game')) {
      newAchievements.push(ACHIEVEMENTS.first_game)
    }

    // O'yinlar soni bo'yicha
    const gamesPlayed = user.stats.gamesPlayed + 1
    if (gamesPlayed === 5 && !currentAchievements.includes('games_5')) {
      newAchievements.push(ACHIEVEMENTS.games_5)
    }
    if (gamesPlayed === 10 && !currentAchievements.includes('games_10')) {
      newAchievements.push(ACHIEVEMENTS.games_10)
    }
    if (gamesPlayed === 50 && !currentAchievements.includes('games_50')) {
      newAchievements.push(ACHIEVEMENTS.games_50)
    }
    if (gamesPlayed === 100 && !currentAchievements.includes('games_100')) {
      newAchievements.push(ACHIEVEMENTS.games_100)
    }

    // Ballar bo'yicha
    if (gameResult.score >= 500 && !currentAchievements.includes('score_500')) {
      newAchievements.push(ACHIEVEMENTS.score_500)
    }
    if (gameResult.score >= 1000 && !currentAchievements.includes('score_1000')) {
      newAchievements.push(ACHIEVEMENTS.score_1000)
    }
    if (gameResult.score >= 1500 && !currentAchievements.includes('score_1500')) {
      newAchievements.push(ACHIEVEMENTS.score_1500)
    }

    // Jami ballar
    const totalScore = user.stats.totalScore + gameResult.score
    if (totalScore >= 5000 && !currentAchievements.includes('total_score_5000')) {
      newAchievements.push(ACHIEVEMENTS.total_score_5000)
    }
    if (totalScore >= 10000 && !currentAchievements.includes('total_score_10000')) {
      newAchievements.push(ACHIEVEMENTS.total_score_10000)
    }

    // Qiyinlik darajasi
    if (gameResult.difficulty === 'easy' && !currentAchievements.includes('difficulty_easy')) {
      newAchievements.push(ACHIEVEMENTS.difficulty_easy)
    }
    if (gameResult.difficulty === 'medium' && !currentAchievements.includes('difficulty_medium')) {
      newAchievements.push(ACHIEVEMENTS.difficulty_medium)
    }
    if (gameResult.difficulty === 'hard' && !currentAchievements.includes('difficulty_hard')) {
      newAchievements.push(ACHIEVEMENTS.difficulty_hard)
    }

    // Tezlik
    if (gameResult.timeSpent && gameResult.timeSpent < 30 && !currentAchievements.includes('speed_demon')) {
      newAchievements.push(ACHIEVEMENTS.speed_demon)
    }

    // Mukammal o'yin (xatosiz)
    if (gameResult.moves && gameResult.moves === 0 && !currentAchievements.includes('perfect_memory')) {
      newAchievements.push(ACHIEVEMENTS.perfect_memory)
    }

    return newAchievements
  }

  // Barcha yutuqlarni olish
  static getAllAchievements() {
    return Object.values(ACHIEVEMENTS)
  }

  // Yutuq haqida ma'lumot olish
  static getAchievement(achievementId) {
    return ACHIEVEMENTS[achievementId]
  }

  // Foydalanuvchi yutuqlari progressini hisoblash
  static calculateProgress(user) {
    const totalAchievements = Object.keys(ACHIEVEMENTS).length
    const earnedAchievements = (user.stats.achievements || []).length
    const totalPoints = Object.values(ACHIEVEMENTS).reduce((sum, ach) => sum + ach.points, 0)
    const earnedPoints = (user.stats.achievements || [])
      .map(id => ACHIEVEMENTS[id]?.points || 0)
      .reduce((sum, points) => sum + points, 0)

    return {
      total: totalAchievements,
      earned: earnedAchievements,
      percentage: Math.round((earnedAchievements / totalAchievements) * 100),
      totalPoints,
      earnedPoints,
      pointsPercentage: Math.round((earnedPoints / totalPoints) * 100)
    }
  }
}

module.exports = AchievementService
