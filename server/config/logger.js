const morgan = require('morgan')
const fs = require('fs')
const path = require('path')

// Logs papkasini yaratish
const logsDir = path.join(__dirname, '..', 'logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir)
}

// Access log stream
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
)

// Error log stream
const errorLogStream = fs.createWriteStream(
  path.join(logsDir, 'error.log'),
  { flags: 'a' }
)

// Custom token - response time in ms
morgan.token('response-time-ms', (req, res) => {
  const responseTime = res.getHeader('X-Response-Time')
  return responseTime ? `${responseTime}ms` : '-'
})

// Development format
const devFormat = morgan('dev')

// Production format - combined with timestamp
const prodFormat = morgan(
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms',
  { stream: accessLogStream }
)

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  const errorLog = `[${new Date().toISOString()}] ${req.method} ${req.url} - ${err.message}\n${err.stack}\n\n`
  errorLogStream.write(errorLog)
  next(err)
}

module.exports = {
  devFormat,
  prodFormat,
  errorLogger
}
