"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, RefreshCw, UserCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { todosSupervisores } from "@/types/escuela"
import type { Escuela } from "@/types/escuela"
import escuelasData from "@/data/escuelas.json"
import { filtrarEscuelas } from "@/lib/escuelas"

// Asegurar que los datos estén tipados correctamente
const escuelas: Escuela[] = escuelasData as Escuela[]

// Texto placeholder que será reemplazado por el análisis generado por IA
const placeholderText = ""

// Texto alternativo para simular cambios cuando se selecciona un supervisor específico
const supervisorSpecificText = ""

// Función para obtener las problemáticas de las escuelas
function obtenerProblematicasPorSupervisor(supervisor: string) {
  const escuelasFiltradas = supervisor === "all" 
    ? escuelas 
    : filtrarEscuelas(escuelas, "", supervisor)

  return escuelasFiltradas.map((escuela: Escuela) => ({
    nombre: escuela.nombre,
    problematicas: escuela.problematicas
  }))
}

// Función para limpiar el texto y convertir markdown a HTML
function limpiarTexto(texto: string): string {
  // Primero convertimos los títulos de escuelas que usan **
  texto = texto.replace(/\d+\.\s*\*\*(.*?)\*\*/g, (match, p1) => {
    return match.replace(/\*\*(.*?)\*\*/, '<strong>$1</strong>');
  });
  
  // Luego eliminamos cualquier otro uso de **
  texto = texto.replace(/\*\*(.*?)\*\*/g, '$1');
  
  return texto;
}

// Función para llamar a la API de Gemini
async function generateGeminiInsight(supervisor: string) {
  try {
    const problematicas = obtenerProblematicasPorSupervisor(supervisor)
    
    const prompt = supervisor === "all"
      ? `Analiza las siguientes problemáticas reportadas en las escuelas y genera un análisis conciso con el siguiente formato:

ESCUELAS CON PROBLEMÁTICAS CRÍTICAS:

1. <strong>Nombre de la escuela</strong>
   - Problemática principal
   - Impacto

2. <strong>Nombre de la escuela</strong>
   - Problemática principal
   - Impacto

(Continuar con máximo 5 escuelas)

${JSON.stringify(problematicas, null, 2)}

Requisitos:
- Máximo 5 escuelas
- Enfócate en los problemas más urgentes
- Usa lenguaje claro y directo
- Incluye solo la información más relevante
- NO uses asteriscos (**) para el formato
- Usa <strong> SOLO para los nombres de las escuelas
- NO uses <strong> en las problemáticas o impactos
- Los nombres de escuelas deben estar en negrita usando <strong>`
      : `Analiza las problemáticas específicas para las escuelas del supervisor ${supervisor} y genera un análisis conciso con el siguiente formato:

ESCUELAS CON PROBLEMÁTICAS CRÍTICAS:

1. <strong>Nombre de la escuela</strong>
   - Problemática principal
   - Impacto

2. <strong>Nombre de la escuela</strong>
   - Problemática principal
   - Impacto

(Continuar con máximo 5 escuelas)

${JSON.stringify(problematicas, null, 2)}

Requisitos:
- Máximo 5 escuelas
- Enfócate en los problemas más urgentes
- Usa lenguaje claro y directo
- Incluye solo la información más relevante
- NO uses asteriscos (**) para el formato
- Usa <strong> SOLO para los nombres de las escuelas
- NO uses <strong> en las problemáticas o impactos
- Los nombres de escuelas deben estar en negrita usando <strong>`

    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, supervisor })
    })

    if (!response.ok) {
      throw new Error('Error en la llamada a la API')
    }

    const data = await response.json()
    return limpiarTexto(data.text)
  } catch (error) {
    console.error('Error al generar insight:', error)
    return 'Lo sentimos, hubo un error al generar el análisis. Por favor, intente nuevamente.'
  }
}

type AIInsightsProps = {}

export default function AIInsights({}: AIInsightsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [insightText, setInsightText] = useState("")
  const [selectedSupervisor, setSelectedSupervisor] = useState("all")
  const [key, setKey] = useState(0)

  // Generar análisis automáticamente al cargar el componente
  useEffect(() => {
    const generateInitialInsight = async () => {
      setIsLoading(true)
      try {
        const generatedText = await generateGeminiInsight(selectedSupervisor)
        setInsightText(generatedText)
      } catch (error) {
        console.error('Error al generar insight inicial:', error)
        setInsightText('Lo sentimos, hubo un error al generar el análisis. Por favor, intente nuevamente.')
      } finally {
        setIsLoading(false)
      }
    }

    generateInitialInsight()
  }, [])

  const handleRegenerateInsight = async () => {
    setIsLoading(true)
    try {
      const generatedText = await generateGeminiInsight(selectedSupervisor)
      setInsightText(generatedText)
    } catch (error) {
      console.error('Error al regenerar insight:', error)
      setInsightText('Lo sentimos, hubo un error al generar el análisis. Por favor, intente nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSupervisorChange = async (value: string) => {
    setIsLoading(true)
    try {
      setSelectedSupervisor(value)
      const generatedText = await generateGeminiInsight(value)
      setInsightText(generatedText)
      setKey((prev) => prev + 1)
    } catch (error) {
      console.error('Error al cambiar supervisor:', error)
      setInsightText('Lo sentimos, hubo un error al generar el análisis. Por favor, intente nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-10 mb-6"
    >
      <Card className="border-verde/20 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-verde/10 to-transparent pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="h-6 w-6 text-verde mr-2" />
              <CardTitle className="text-xl md:text-2xl">🧠 Análisis Automático de Problemáticas Actuales</CardTitle>
            </div>
            <button
              onClick={handleRegenerateInsight}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-verde/10 transition-colors text-verde"
              aria-label="Regenerar análisis"
              title="Regenerar análisis"
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
          <CardDescription className="mt-1">
            Análisis generado por inteligencia artificial basado en los datos del sistema
          </CardDescription>
        </CardHeader>

        <div className="px-6 pt-4 pb-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5 text-verde" aria-hidden="true" />
            <label htmlFor="supervisor-select" className="text-sm font-medium text-gray-700">
              Filtrar análisis por supervisor:
            </label>
            <Select value={selectedSupervisor} onValueChange={handleSupervisorChange} disabled={isLoading}>
              <SelectTrigger 
                id="supervisor-select" 
                className="w-full max-w-xs bg-white border-gray-300 rounded-xl focus:ring-2 focus:ring-verde focus:border-verde transition-colors"
                aria-label="Seleccionar supervisor para filtrar el análisis"
              >
                <SelectValue placeholder="Seleccionar supervisor" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all" className="focus:bg-verde/10">
                  <strong>Análisis General</strong>
                </SelectItem>
                {todosSupervisores.sort().map((supervisor) => (
                  <SelectItem key={supervisor} value={supervisor} className="focus:bg-verde/10">
                    {supervisor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSupervisor !== "all" && (
            <div className="mt-2 text-sm text-verde font-medium flex items-center">
              <UserCheck className="h-4 w-4 mr-1" />
              Mostrando análisis específico para: {selectedSupervisor}
            </div>
          )}
        </div>

        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <div className="space-y-4 w-full max-w-2xl">
                <div className="flex items-center justify-center">
                  <Brain className="h-12 w-12 text-verde/40 animate-pulse" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-verde/10 rounded w-3/4 mx-auto animate-pulse" />
                  <div className="h-4 bg-verde/10 rounded w-1/2 mx-auto animate-pulse" />
                  <div className="h-4 bg-verde/10 rounded w-2/3 mx-auto animate-pulse" />
                </div>
                <p className="text-center text-gray-500 mt-4">
                  {selectedSupervisor === "all"
                    ? "Generando nuevo análisis..."
                    : `Generando análisis para ${selectedSupervisor}...`}
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="prose prose-green max-w-none"
              >
                {insightText.split("\n").map((line, index) => (
                  <div 
                    key={index} 
                    className="mb-4 text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: line }}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
