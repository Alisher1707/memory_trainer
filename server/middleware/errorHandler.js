// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({
      error: 'Validatsiya xatosi',
      details: messages
    })
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0]
    return res.status(400).json({
      error: `Bu ${field} allaqachon ishlatilmoqda`
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Token yaroqsiz' })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token muddati tugagan' })
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Yaroqsiz ID formati' })
  }

  // Default error
  res.status(err.statusCode || 500).json({
    error: err.message || 'Server xatoligi'
  })
}

// Not Found handler
const notFound = (req, res, next) => {
  res.status(404).json({
    error: 'Endpoint topilmadi',
    path: req.originalUrl
  })
}

module.exports = { errorHandler, notFound }
