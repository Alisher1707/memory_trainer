const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ism kiritish shart'],
    trim: true,
    minlength: [2, 'Ism kamida 2 belgidan iborat bo\'lishi kerak'],
    maxlength: [50, 'Ism 50 belgidan oshmasligi kerak']
  },
  email: {
    type: String,
    required: [true, 'Email kiritish shart'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email formati noto\'g\'ri']
  },
  password: {
    type: String,
    required: [true, 'Parol kiritish shart'],
    minlength: [6, 'Parol kamida 6 belgidan iborat bo\'lishi kerak']
  },
  stats: {
    gamesPlayed: {
      type: Number,
      default: 0
    },
    totalScore: {
      type: Number,
      default: 0
    },
    bestScores: {
      type: Map,
      of: Number,
      default: new Map()
    },
    achievements: [{
      type: String
    }],
    recentGames: [{
      gameType: String,
      score: Number,
      difficulty: String,
      timeSpent: Number,
      moves: Number,
      timestamp: Date,
      date: String
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Index qo'shish tezkor qidiruv uchun
userSchema.index({ email: 1 })
userSchema.index({ 'stats.totalScore': -1 })

// Virtual field - passwordni response ga qo'shmaslik
userSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password
    return ret
  }
})

module.exports = mongoose.model('User', userSchema)
