import fs from 'fs'
import path from 'path'

interface CacheEntry {
  data: string
  timestamp: number
}

const CACHE_DIR = path.join(process.cwd(), 'public', 'cache')
const CACHE_FILE = path.join(CACHE_DIR, 'analisis.json')
const CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000 // 7 días en milisegundos

// Asegurar que el directorio de caché exista
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true })
}

// Asegurar que el archivo de caché exista
if (!fs.existsSync(CACHE_FILE)) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify({}))
}

function readCache(): Record<string, CacheEntry> {
  try {
    const data = fs.readFileSync(CACHE_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error al leer el caché:', error)
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