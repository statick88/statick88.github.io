import type { MiddlewareHandler } from 'astro'

export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next()

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), accelerometer=(), gyroscope=(), magnetometer=(), payment=(), usb=()')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

  // Content Security Policy (CSP)
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https://*.githubusercontent.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://www.google-analytics.com",
      "frame-src 'none'",
      "object-src 'none'",
    ].join('; ')
  )

  return response
}
