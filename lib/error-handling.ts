interface ErrorContext {
  componentName?: string
  timestamp?: string
  userAgent?: string
  path?: string
}

export function logError(error: Error, context: ErrorContext = {}) {
  const errorData = {
    message: error.message,
    stack: error.stack,
    ...context,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    path: typeof window !== 'undefined' ? window.location.pathname : 'server'
  }

  // Aquí puedes enviar el error a un servicio de monitoreo como Sentry, LogRocket, etc.
  console.error('Error:', errorData)

  // También puedes implementar el envío a tu backend
  if (process.env.NODE_ENV === 'production') {
    // fetch('/api/log-error', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorData)
    // })
  }
}

export function createError(message: string, context?: ErrorContext): Error {
  const error = new Error(message)
  logError(error, context)
  return error
}

export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    logError(error, { componentName: 'API' })
    return error.message
  }
  return 'Ocurrió un error inesperado al procesar la solicitud'
} 