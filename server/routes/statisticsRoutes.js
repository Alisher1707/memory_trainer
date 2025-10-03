const express = require('express')
const router = express.Router()
const { authenticateToken, optionalAuth } = require('../middleware/auth')
const StatisticsService = require('../services/statisticsService')

// Global statistika
router.get('/global', optionalAuth, async (req, res, next) => {
  try {
    const statistics = await StatisticsService.getGlobalStatistics()
    res.json({ success: true, statistics })
  } catch (error) {
    next(error)
  }
})

// Davriy hisobot
router.get('/report/:period', optionalAuth, async (req, res, next) => {
  try {
    const { period } = req.params
    const validPeriods = ['day', 'week', 'month']

    if (!validPeriods.includes(period)) {
      return res.status(400).json({ error: 'Noto\'g\'ri davr. Qabul qilinadigan: day, week, month' })
    }

    const report = await StatisticsService.getPeriodicReport(period)
    res.json({ success: true, report })
  } catch (error) {
    next(error)
  }
})

// Ikki foydalanuvchini taqqoslash
router.get('/compare/:userId1/:userId2', authenticateToken, async (req, res, next) => {
  try {
    const { userId1, userId2 } = req.params
    const comparison = await StatisticsService.compareUsers(userId1, userId2)
    res.json({ success: true, comparison })
  } catch (error) {
    next(error)
  }
})

// Foydalanuvchi oxirgi faoliyati
router.get('/activity/:userId', authenticateToken, async (req, res, next) => {
  try {
    const { userId } = req.params
    const { days = 7 } = req.query

    const activity = await StatisticsService.getRecentActivity(userId, parseInt(days))
    res.json({ success: true, activity })
  } catch (error) {
    next(error)
  }
})

module.exports = router
