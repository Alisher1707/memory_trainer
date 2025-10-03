const helmet = require('helmet')

// Security configuration
const securityConfig = () => {
  return [
    // Helmet - turli xil xavfsizlik headerlarini qo'shadi
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),

    // HSTS - HTTPS ni majburiy qilish
    helmet.hsts({
      maxAge: 31536000, // 1 yil
      includeSubDomains: true,
      preload: true
    }),

    // XSS himoyasi
    helmet.xssFilter(),

    // Clickjacking himoyasi
    helmet.frameguard({ action: 'deny' }),

    // MIME type sniffing oldini olish
    helmet.noSniff(),

    // Powered-by headerini olib tashlash
    helmet.hidePoweredBy(),
  ]
}

module.exports = securityConfig
