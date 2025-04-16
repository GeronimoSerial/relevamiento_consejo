import fs from 'fs'
import path from 'path'

interface CacheEntry {
  data: string
  timestamp: number
}

const CACHE_FILE = path.join(process.cwd(), 'public', 'analisis.json')
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000 // 24 horas en milisegundos

function readCache(): Record<string, CacheEntry> {
  try {
    const data = fs.readFileSync(CACHE_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return {}
  }
}

function writeCache(cache: Record<string, CacheEntry>) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2))
  } catch (error) {
    console.error('Error al escribir en el caché:', error)
  }
}

export function getCachedResponse(key: string): string | null {
  const cache = readCache()
  const entry = cache[key]
  
  if (!entry) return null

  // Verificar si el caché ha expirado
  if (Date.now() - entry.timestamp > CACHE_EXPIRATION) {
    delete cache[key]
    writeCache(cache)
    return null
  }

  return entry.data
}

export function setCachedResponse(key: string, data: string) {
  const cache = readCache()
  cache[key] = {
    data,
    timestamp: Date.now()
  }
  writeCache(cache)
} 