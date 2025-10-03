const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  gameType: {
    type: String,
    required: [true, 'O\'yin turi kiritish shart'],
    enum: ['memory_card', 'number_sequence', 'color_sequence'],
    index: true
  },
  score: {
    type: Number,
    required: [true, 'Natija kiritish shart'],
    min: [0, 'Natija 0 dan kichik bo\'lishi mumkin emas'],
    index: true
  },
  difficulty: {
    type: String,
    required: [true, 'Qiyinlik darajasi kiritish shart'],
    enum: ['easy', 'medium', 'hard'],
    index: true
  },
  timeSpent: {
    type: Number,
    required: true,
    min: 0
  },
  moves: {
    type: Number,
    default: 0,
    min: 0
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  date: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

// Compound index - tez qidiruv uchun
scoreSchema.index({ gameType: 1, difficulty: 1, score: -1 })
scoreSchema.index({ userId: 1, timestamp: -1 })
scoreSchema.index({ score: -1, timestamp: -1 })

module.exports = mongoose.model('Score', scoreSchema)
