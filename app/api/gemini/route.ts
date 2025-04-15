import { NextResponse } from "next/server"
import { getCachedResponse, setCachedResponse } from "@/lib/cache"

export async function POST(request: Request) {
  try {
    const { prompt, supervisor } = await request.json()
    
    // Crear una clave única para el caché basada en el supervisor
    const cacheKey = `gemini_${supervisor || 'all'}`

    // Intentar obtener la respuesta del caché
    const cachedResponse = getCachedResponse(cacheKey)
    if (cachedResponse) {
      return NextResponse.json({ text: cachedResponse })
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    )

    if (!response.ok) {
      throw new Error('Error en la llamada a la API de Gemini')
    }

    const data = await response.json()
    const text = data.candidates[0].content.parts[0].text

    // Guardar en caché
    setCachedResponse(cacheKey, text)

    return NextResponse.json({ text })
  } catch (error) {
    console.error('Error al generar insight:', error)
    return NextResponse.json(
      { error: 'Error al generar el análisis' },
      { status: 500 }
    )
  }
} 