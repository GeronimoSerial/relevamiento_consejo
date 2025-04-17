import { NextResponse } from "next/server"
import escuelasData from "@/data/escuelas.json"
import type { Escuela } from "@/types/iEscuela"
import { getCachedResponse, setCachedResponse } from "@/lib/cache"

// Procesar los datos de escuelas solo una vez
const escuelas: Escuela[] = (escuelasData as Escuela[]).map(escuela => ({
  ...escuela,
  fechaFundacion2: typeof escuela.fechaFundacion2 === "number"
    ? escuela.fechaFundacion2
    : Number(escuela.fechaFundacion2)
}));

// Función para optimizar los datos antes de enviarlos a la IA
function optimizeSchoolData(escuelas: Escuela[]) {
  // Valores a excluir de las problemáticas
  const problematicasNoRelevantes = [
    "No presenta",
    "Sin problemáticas",
    "Sin problemas",
    "No hay problemas",
    "No hay problemáticas",
    "Sin inconvenientes",
    "Sin dificultades",
    "Sin problemas de infraestructura",
    "No tiene",
    "No hay",
    "No hay problemas",
    "No hay problemáticas",
    "No hay inconvenientes",
    "No hay dificultades"
  ];

  // Problemáticas genéricas que tienen menor prioridad
  const problematicasGenericas = [
    "Dimension Organizativa",
    "Dimension Pedagogica",
    "Dimension Administrativa",
    "Dimensión",
    "Dimension",
    "Problema",
    "Problemática",
    "Situación",
    "Cuestión"
  ];

  return escuelas
    .map(escuela => {
      const problematicas = Array.isArray(escuela.problematicas)
        ? escuela.problematicas
        : [escuela.problematicas];

      // Filtrar problemáticas una sola vez
      const problematicasRelevantes = problematicas.filter(p =>
        p &&
        !problematicasNoRelevantes.some(noRelevante =>
          p.toLowerCase().includes(noRelevante.toLowerCase())
        )
      );

      return {
        nombre: escuela.nombre,
        cue: escuela.cue,
        problematicas: problematicasRelevantes,
        prioridad: problematicasRelevantes.some(p =>
          !problematicasGenericas.some(generica =>
            p.toLowerCase().includes(generica.toLowerCase())
          )
        ) ? 1 : 0
      };
    })
    .filter(escuela => escuela.problematicas.length > 0)
    .sort((a, b) => {
      if (a.prioridad !== b.prioridad) {
        return b.prioridad - a.prioridad;
      }
      return b.problematicas.length - a.problematicas.length;
    });
}

export async function GET() {
  try {
    const cacheKey = 'daily_analysis';
    const cachedAnalysis = getCachedResponse(cacheKey);
    
    // Si hay un análisis en caché, lo devolvemos
    if (cachedAnalysis) {
      return NextResponse.json({ text: cachedAnalysis });
    }

    // Optimizar los datos antes de enviarlos
    const optimizedData = optimizeSchoolData(escuelas);
    
    const prompt = `Analiza las siguientes problemáticas reportadas en las escuelas y genera un análisis conciso con el siguiente formato:

<u>ESCUELAS CON PROBLEMÁTICAS CRÍTICAS:</u>

1. <strong>Nombre de la escuela</strong>
   - <b>Problemática principal</b>
   - <b>Impacto</b>

2. <strong>Nombre de la escuela</strong>
   - <b>Problemática principal</b>
   - <b>Impacto</b>

(Continuar con máximo 5 escuelas)

${JSON.stringify(optimizedData, null, 2)}

Requisitos:
- Máximo 5 escuelas
- Prioriza escuelas con múltiples problemáticas
- Enfócate en problemas que afecten directamente a los estudiantes
- Considera problemas de infraestructura como críticos
- Prioriza problemas que afecten la continuidad pedagógica
- Usa lenguaje claro y directo
- Incluye solo la información más relevante
- NO uses asteriscos (**) para el formato
- Usa <strong> SOLO para los nombres de las escuelas
- NO uses <strong> en las problemáticas o impactos, utiliza <b> en su lugar
- Los nombres de escuelas deben estar en negrita usando <strong>`;

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
    );

    if (!response.ok) {
      throw new Error('Error en la llamada a la API de Gemini');
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    // Guardar en caché
    setCachedResponse(cacheKey, text);

    return NextResponse.json({ text });
  } catch (error) {
    console.error('Error al generar análisis diario:', error);
    return NextResponse.json(
      { error: 'Error al generar el análisis diario' },
      { status: 500 }
    );
  }
}
