"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, RefreshCw, UserCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { todosSupervisores } from "@/types/iEscuela"
import { generateGeminiInsight } from "@/lib/ai"


type AIInsightsProps = {}

export default function AIInsights({}: AIInsightsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [insightText, setInsightText] = useState("")
  const [selectedSupervisor, setSelectedSupervisor] = useState("all")

  const generateInsight = async (supervisor: string) => {
    setIsLoading(true)
    try {
      const generatedText = await generateGeminiInsight(supervisor)
      setInsightText(generatedText)
    } catch (error) {
      console.error('Error al generar insight:', error)
      setInsightText('Lo sentimos, hubo un error al generar el análisis. Por favor, intente nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Generar análisis inicial
  useEffect(() => {
    generateInsight(selectedSupervisor)
  }, [])

  const handleSupervisorChange = async (value: string) => {
    setSelectedSupervisor(value)
    await generateInsight(value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mt-10 mb-6"
    >
      <Card className="border-verde/20 overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-verde/10 to-transparent pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="h-6 w-6 text-verde mr-2" />
              <CardTitle className="text-xl md:text-2xl">🧠 Análisis Automático de Problemáticas Actuales</CardTitle>
            </div>
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
            <Select 
              value={selectedSupervisor} 
              onValueChange={handleSupervisorChange} 
              disabled={isLoading}
            >
              <SelectTrigger 
                id="supervisor-select" 
                className={`w-full max-w-xs bg-white border-gray-300 rounded-xl shadow-md transition-all duration-200
                  ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                  hover:border-verde hover:ring-2 hover:ring-verde/20
                  focus:border-verde focus:ring-2 focus:ring-verde/20
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde/20
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300
                `}
                aria-label="Seleccionar supervisor para filtrar el análisis"
                aria-disabled={isLoading}
              >
                <SelectValue placeholder="Seleccionar supervisor" />
              </SelectTrigger>
              <SelectContent 
                className="bg-white border-gray-200 shadow-lg rounded-xl"
                position="popper"
              >
                <SelectItem 
                  value="all" 
                  className="focus:bg-verde/10 focus:text-verde data-[state=checked]:bg-verde/10 data-[state=checked]:text-verde"
                  aria-label="Análisis General"
                >
                  <strong>Análisis General</strong>
                </SelectItem>
                {todosSupervisores.sort().map((supervisor) => (
                  <SelectItem 
                    key={supervisor} 
                    value={supervisor}
                    className="focus:bg-verde/10 focus:text-verde data-[state=checked]:bg-verde/10 data-[state=checked]:text-verde"
                    aria-label={`Supervisor ${supervisor}`}
                  >
                    {supervisor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSupervisor !== "all" && (
            <div className="mt-2 text-sm text-verde font-medium flex items-center animate-fade-in">
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
            <div className="prose prose-green max-w-none">
              {insightText.split("\n").map((line, index) => (
                <div 
                  key={index} 
                  className="mb-4 text-gray-700 leading-relaxed animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  dangerouslySetInnerHTML={{ __html: line }}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
