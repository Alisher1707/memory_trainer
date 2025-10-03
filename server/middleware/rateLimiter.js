const rateLimit = require('express-rate-limit')

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 100, // Har bir IP uchun maksimal 100 ta so'rov
  message: {
    error: 'Juda ko\'p so\'rov yuborildi. Iltimos keyinroq urinib ko\'ring.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Auth endpoints uchun qattiqroq limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 5, // Har bir IP uchun maksimal 5 ta so'rov
  skipSuccessfulRequests: true, // Muvaffaqiyatli so'rovlarni hisoblamaslik
  message: {
    error: 'Juda ko\'p login urinishi. 15 daqiqadan keyin qayta urinib ko\'ring.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Score submission limiter
const scoreLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 daqiqa
  max: 10, // Har daqiqada maksimal 10 ta natija
  message: {
    error: 'Juda ko\'p natija yuborildi. Iltimos biroz kuting.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

module.exports = {
  apiLimiter,
  authLimiter,
  scoreLimiter
}
