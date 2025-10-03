const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { generateToken } = require('../middleware/auth')
const { validateSignup, validateLogin } = require('../middleware/validator')
const { authLimiter } = require('../middleware/rateLimiter')

// Signup endpoint
router.post('/signup', authLimiter, validateSignup, async (req, res, next) => {
  try {
    const { email, password, name } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Bu email allaqachon ro\'yxatdan o\'tgan' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      email,
      name,
      password: hashedPassword,
      stats: {
        gamesPlayed: 0,
        totalScore: 0,
        bestScores: new Map(),
        achievements: [],
        recentGames: []
      }
    })

    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      user: user.toJSON(),
      token
    })
  } catch (error) {
    next(error)
  }
})

// Login endpoint
router.post('/login', authLimiter, validateLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'Email yoki parol noto\'g\'ri' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Email yoki parol noto\'g\'ri' })
    }

    // Oxirgi kirishni yangilash
    user.lastLogin = new Date()
    await user.save()

    const token = generateToken(user._id)

    res.json({
      success: true,
      user: user.toJSON(),
      token
    })
  } catch (error) {
    next(error)
  }
})

// Verify token endpoint
router.get('/verify', async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Token topilmadi' })
    }

    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'memory_trainer_secret')

    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return res.status(401).json({ error: 'Foydalanuvchi topilmadi' })
    }

    res.json({
      success: true,
      user: user.toJSON()
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
