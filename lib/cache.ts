interface CacheEntry {
  data: string
  timestamp: number
}

const cache: Record<string, CacheEntry> = {}

export function getCachedResponse(key: string): string | null {
  const entry = cache[key]
  if (!entry) return null

  // Verificar si la entrada es más vieja que 24 horas
  const now = Date.now()
  const oneDay = 24 * 60 * 60 * 1000 // 24 horas en milisegundos
  if (now - entry.timestamp > oneDay) {
    delete cache[key]
    return null
  }

  return entry.data
}

export function setCachedResponse(key: string, data: string) {
  cache[key] = {
    data,
    timestamp: Date.now()
  }
} 