"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, RefreshCw, UserCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { todosSupervisores } from "@/types/escuela"
import type { Escuela } from "@/types/escuela"
import escuelasData from "@/data/escuelas.json"

// Texto placeholder que será reemplazado por el análisis generado por IA
const placeholderText = ""

// Texto alternativo para simular cambios cuando se selecciona un supervisor específico
const supervisorSpecificText = ""

// Función para obtener las problemáticas de las escuelas
function obtenerProblematicasPorSupervisor(supervisor: string) {
  const escuelasFiltradas = supervisor === "all" 
    ? escuelasData 
    : escuelasData.filter((escuela: Escuela) => escuela.supervisor === supervisor)

  return escuelasFiltradas.map((escuela: Escuela) => ({
    nombre: escuela.nombre,
    problematicas: escuela.problematicas
  }))
}

// Función para llamar a la API de Gemini
async function generateGeminiInsight(supervisor: string) {
  try {
    const problematicas = obtenerProblematicasPorSupervisor(supervisor)
    
    const prompt = supervisor === "all"
      ? `Analiza las siguientes problemáticas reportadas en las escuelas y genera un listado numerado (máximo 5 items) ordenado por prioridad:

${JSON.stringify(problematicas, null, 2)}

Formato de respuesta requerido (cada problema debe estar en una línea separada):
1- Escuela Primaria N° 8 - Instalaciones eléctricas antiguas (Riesgo de incendios y electrocución)
2- Escuela Primaria N° 1 - Necesidad de reparación en techos (Riesgo de derrumbe)
...

Enfócate en los problemas más críticos y urgentes.`
      : `Analiza las problemáticas específicas para las escuelas del supervisor ${supervisor} y genera un listado numerado (máximo 5 items) ordenado por prioridad:

${JSON.stringify(problematicas, null, 2)}

Formato de respuesta requerido (cada problema debe estar en una línea separada):
1- Escuela Primaria N° 8 - Instalaciones eléctricas antiguas (Riesgo de incendios y electrocución)
2- Escuela Primaria N° 1 - Necesidad de reparación en techos (Riesgo de derrumbe)
...

Enfócate en los problemas más críticos y urgentes de las escuelas bajo su supervisión.`

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
    return data.text
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
            <UserCheck className="h-5 w-5 text-verde" />
            <label htmlFor="supervisor-select" className="text-sm font-medium text-gray-700">
              Filtrar análisis por supervisor:
            </label>
            <Select value={selectedSupervisor} onValueChange={handleSupervisorChange} disabled={isLoading}>
              <SelectTrigger id="supervisor-select" className="w-full max-w-xs bg-white border-gray-300 rounded-xl">
                <SelectValue placeholder="Seleccionar supervisor" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">
                  <strong>Análisis General</strong>
                </SelectItem>
                {todosSupervisores.sort().map((supervisor) => (
                  <SelectItem key={supervisor} value={supervisor}>
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
            <div className="flex flex-col items-center justify-center py-8">
              <Brain className="h-12 w-12 text-verde/40 animate-pulse mb-4" />
              <p className="text-gray-500">
                {selectedSupervisor === "all"
                  ? "Generando nuevo análisis..."
                  : `Generando análisis para ${selectedSupervisor}...`}
              </p>
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
                  <div key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {line}
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
