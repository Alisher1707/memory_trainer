// Input validation middleware
const validateSignup = (req, res, next) => {
  const { email, password, name } = req.body

  const errors = []

  if (!name || name.trim().length < 2) {
    errors.push('Ism kamida 2 belgidan iborat bo\'lishi kerak')
  }

  if (!email || !isValidEmail(email)) {
    errors.push('Email formati noto\'g\'ri')
  }

  if (!password || password.length < 6) {
    errors.push('Parol kamida 6 belgidan iborat bo\'lishi kerak')
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validatsiya xatosi', details: errors })
  }

  next()
}

const validateLogin = (req, res, next) => {
  const { email, password } = req.body

  const errors = []

  if (!email || !isValidEmail(email)) {
    errors.push('Email formati noto\'g\'ri')
  }

  if (!password) {
    errors.push('Parol kiritish shart')
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validatsiya xatosi', details: errors })
  }

  next()
}

const validateScore = (req, res, next) => {
  const { gameType, score, difficulty } = req.body

  const errors = []

  const validGameTypes = ['memory_card', 'number_sequence', 'color_sequence']
  const validDifficulties = ['easy', 'medium', 'hard']

  if (!gameType || !validGameTypes.includes(gameType)) {
    errors.push('O\'yin turi noto\'g\'ri')
  }

  if (score === undefined || score < 0) {
    errors.push('Natija 0 dan kichik bo\'lishi mumkin emas')
  }

  if (!difficulty || !validDifficulties.includes(difficulty)) {
    errors.push('Qiyinlik darajasi noto\'g\'ri')
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validatsiya xatosi', details: errors })
  }

  next()
}

// Helper function
const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  return emailRegex.test(email)
}

module.exports = {
  validateSignup,
  validateLogin,
  validateScore
}
