"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, RefreshCw, UserCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { todosSupervisores } from "@/types/escuela"

// Texto placeholder que será reemplazado por el análisis generado por IA
const placeholderText = `
Basado en los datos analizados, se identifican las siguientes problemáticas prioritarias en el sistema educativo:

1. **Infraestructura deficiente**: El 35% de las escuelas reportan problemas en techos y sistemas eléctricos, principalmente en zonas rurales y periurbanas. Se recomienda priorizar reparaciones en las escuelas de los departamentos Paraná y Concordia.

2. **Conectividad limitada**: Solo el 42% de las instituciones cuentan con conexión a internet de alta velocidad (>50MB), lo que dificulta la implementación de recursos digitales. Las escuelas rurales son las más afectadas, con solo 15% de cobertura adecuada.

3. **Distribución desigual de recursos profesionales**: Se observa una concentración de profesionales de apoyo en escuelas urbanas de categoría 1, mientras que las escuelas rurales y de categoría 3 presentan carencias significativas.

4. **Oportunidades de mejora**: Implementar un programa de mejora de infraestructura focalizado en las 20 escuelas con problemas críticos identificadas en este relevamiento, y expandir el programa de conectividad rural a 15 nuevas escuelas en el próximo trimestre.
`

// Texto alternativo para simular cambios cuando se selecciona un supervisor específico
const supervisorSpecificText = `
Análisis específico para el supervisor seleccionado:

1. **Rendimiento comparativo**: Las escuelas bajo su supervisión muestran un 12% más de participación en programas de acompañamiento que el promedio provincial, destacando especialmente en programas de alfabetización.

2. **Áreas de atención**: Se identifican 3 escuelas con problemas críticos de infraestructura que requieren intervención inmediata, particularmente en los techos y sistemas eléctricos.

3. **Conectividad**: El 38% de las escuelas supervisadas cuentan con conexión a internet adecuada, ligeramente por debajo del promedio provincial (42%). Se recomienda priorizar la mejora de conectividad en las escuelas rurales.

4. **Recomendaciones personalizadas**: Implementar un plan de visitas focalizadas a las 5 escuelas con mayor matrícula para evaluar la distribución de recursos profesionales y optimizar su aprovechamiento.
`

type AIInsightsProps = {}

export default function AIInsights({}: AIInsightsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [insightText, setInsightText] = useState(placeholderText)
  const [selectedSupervisor, setSelectedSupervisor] = useState("all")
  const [key, setKey] = useState(0) // Clave para forzar la re-renderización de la animación

  // Esta función simula la regeneración del análisis
  // En el futuro, aquí se implementaría la llamada real a la IA
  const handleRegenerateInsight = () => {
    setIsLoading(true)

    // Simulación de carga
    setTimeout(() => {
      setIsLoading(false)
      // Por ahora solo restablecemos el mismo texto
      // Aquí se implementaría la lógica para obtener nuevo texto de la IA
      setInsightText(placeholderText)
    }, 1500)
  }

  // Manejar el cambio de supervisor
  const handleSupervisorChange = (value: string) => {
    setIsLoading(true)

    // Simulación de carga
    setTimeout(() => {
      setSelectedSupervisor(value)
      setIsLoading(false)

      // Simular diferentes análisis según el supervisor seleccionado
      if (value === "all") {
        setInsightText(placeholderText)
      } else {
        setInsightText(supervisorSpecificText.replace("el supervisor seleccionado", value))
      }

      // Cambiar la clave para forzar la re-renderización de la animación
      setKey((prev) => prev + 1)
    }, 800)
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
                {insightText.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
