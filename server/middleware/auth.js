const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Token generatsiya qilish
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'memory_trainer_secret',
    { expiresIn: '7d' }
  )
}

// Token tekshirish middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Access token talab qilinadi' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'memory_trainer_secret')

    // Foydalanuvchini tekshirish
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return res.status(401).json({ error: 'Foydalanuvchi topilmadi' })
    }

    req.user = { userId: decoded.userId, userDoc: user }
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Token yaroqsiz' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token muddati tugagan' })
    }
    return res.status(403).json({ error: 'Token xatoligi' })
  }
}

// Optional auth - token bo'lmasa ham davom etadi
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'memory_trainer_secret')
      const user = await User.findById(decoded.userId).select('-password')
      if (user) {
        req.user = { userId: decoded.userId, userDoc: user }
      }
    }
    next()
  } catch (error) {
    // Token xato bo'lsa ham davom etadi
    next()
  }
}

// Admin tekshirish (kelajakda kerak bo'lishi mumkin)
const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userDoc) {
      return res.status(401).json({ error: 'Autentifikatsiya talab qilinadi' })
    }

    if (!req.user.userDoc.isAdmin) {
      return res.status(403).json({ error: 'Admin huquqlari kerak' })
    }

    next()
  } catch (error) {
    res.status(500).json({ error: 'Server xatoligi' })
  }
}

// O'z ma'lumotlarini tekshirish
const isSelfOrAdmin = async (req, res, next) => {
  try {
    const requestedUserId = req.params.userId

    if (!req.user) {
      return res.status(401).json({ error: 'Autentifikatsiya talab qilinadi' })
    }

    const isSelf = req.user.userId === requestedUserId
    const isUserAdmin = req.user.userDoc?.isAdmin

    if (!isSelf && !isUserAdmin) {
      return res.status(403).json({ error: 'Ruxsat berilmagan' })
    }

    next()
  } catch (error) {
    res.status(500).json({ error: 'Server xatoligi' })
  }
}

module.exports = {
  generateToken,
  authenticateToken,
  optionalAuth,
  isAdmin,
  isSelfOrAdmin
}
