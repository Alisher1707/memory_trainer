const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const { authenticateToken, isSelfOrAdmin } = require('../middleware/auth')
const StatisticsService = require('../services/statisticsService')
const AchievementService = require('../services/achievementService')

// Foydalanuvchi profilini olish
router.get('/:userId', authenticateToken, async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId).select('-password').lean()

    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' })
    }

    res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
})

// Profilni yangilash
router.put('/:userId', authenticateToken, isSelfOrAdmin, async (req, res, next) => {
  try {
    const { userId } = req.params
    const { name, email } = req.body

    const updateData = {}
    if (name) updateData.name = name
    if (email) updateData.email = email

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' })
    }

    res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
})

// Parolni o'zgartirish
router.put('/:userId/password', authenticateToken, isSelfOrAdmin, async (req, res, next) => {
  try {
    const { userId } = req.params
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Hamma parollar kiritilishi shart' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Yangi parol kamida 6 belgidan iborat bo\'lishi kerak' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' })
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Joriy parol noto\'g\'ri' })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    res.json({ success: true, message: 'Parol muvaffaqiyatli o\'zgartirildi' })
  } catch (error) {
    next(error)
  }
})

// Foydalanuvchi statistikasi
router.get('/:userId/stats', authenticateToken, async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId).lean()

    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' })
    }

    res.json({ success: true, stats: user.stats })
  } catch (error) {
    next(error)
  }
})

// To'liq statistika (service orqali)
router.get('/:userId/statistics', authenticateToken, async (req, res, next) => {
  try {
    const { userId } = req.params
    const statistics = await StatisticsService.getUserStatistics(userId)

    res.json({ success: true, statistics })
  } catch (error) {
    next(error)
  }
})

// Foydalanuvchi yutuqlari
router.get('/:userId/achievements', authenticateToken, async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId).select('stats.achievements').lean()

    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' })
    }

    const achievementIds = user.stats.achievements || []
    const achievements = achievementIds.map(id => AchievementService.getAchievement(id)).filter(Boolean)

    const progress = AchievementService.calculateProgress(user)

    res.json({
      success: true,
      achievements,
      progress,
      allAchievements: AchievementService.getAllAchievements()
    })
  } catch (error) {
    next(error)
  }
})

// O'chirish (o'z hisobini o'chirish)
router.delete('/:userId', authenticateToken, isSelfOrAdmin, async (req, res, next) => {
  try {
    const { userId } = req.params

    const user = await User.findByIdAndDelete(userId)
    if (!user) {
      return res.status(404).json({ error: 'Foydalanuvchi topilmadi' })
    }

    // Foydalanuvchi natijalarini ham o'chirish
    const Score = require('../models/Score')
    await Score.deleteMany({ userId })

    res.json({ success: true, message: 'Hisob muvaffaqiyatli o\'chirildi' })
  } catch (error) {
    next(error)
  }
})

module.exports = router
