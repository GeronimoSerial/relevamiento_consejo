"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, BarChart3, School, Wifi, Users, FileSpreadsheet } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"
import type { Escuela } from "@/types/escuela"

// Importar componentes de gráficos de forma dinámica para evitar errores de SSR
const MatriculaPorDepartamento = dynamic(() => import("@/components/graficos/MatriculaPorDepartamento"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-[300px]">Cargando gráfico...</div>,
})
const EscuelasPorCategoria = dynamic(() => import("@/components/graficos/EscuelasPorCategoria"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-[300px]">Cargando gráfico...</div>,
})
const EdificioPropio = dynamic(() => import("@/components/graficos/EdificioPropio"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-[300px]">Cargando gráfico...</div>,
})
const ConectividadInternet = dynamic(() => import("@/components/graficos/ConectividadInternet"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-[300px]">Cargando gráfico...</div>,
})
const ProgramasAcompanamiento = dynamic(() => import("@/components/graficos/ProgramasAcompanamiento"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-[300px]">Cargando gráfico...</div>,
})
const AvanceLocalidades = dynamic(() => import("@/components/graficos/AvanceLocalidades"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-[300px]">Cargando gráfico...</div>,
})

interface EstadisticasSectionProps {
  escuelas: Escuela[]
}

export default function EstadisticasSection({ escuelas }: EstadisticasSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  // Estadísticas generales calculadas una sola vez
  const estadisticasGenerales = useMemo(() => {
    const totalEscuelas = escuelas.length
    const totalMatricula = escuelas.reduce((sum, escuela) => sum + (escuela.matricula2025 || 0), 0)
    const totalDepartamentos = new Set(escuelas.map((e) => e.departamento)).size
    const totalDirectores = new Set(escuelas.map((e) => e.director)).size

    return {
      totalEscuelas,
      totalMatricula,
      totalDepartamentos,
      totalDirectores,
      promedioMatricula: Math.round(totalMatricula / totalEscuelas),
    }
  }, [escuelas])

  return (
    <section className="mt-12 mb-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-verde/20">
          {/* Cabecera con toggle */}
          <div
            className="p-6 flex justify-between items-center cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 md:h-6 md:w-6 text-verde" />📊 Informes y Estadísticas
              </h2>
              <p className="text-sm text-gray-600 mt-1">Visualización de datos relevantes sobre el sistema educativo</p>
            </div>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={isExpanded ? "Contraer sección" : "Expandir sección"}
            >
              {isExpanded ? (
                <ChevronUp className="h-6 w-6 text-gray-600" />
              ) : (
                <ChevronDown className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>

          {/* Contenido expandible */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="px-4 md:px-6 pb-6"
            >
              {/* Tarjetas de estadísticas generales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
                <Card>
                  <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
                    <CardTitle className="text-sm md:text-lg flex items-center">
                      <School className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5 text-verde" />
                      Total Escuelas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                    <p className="text-xl md:text-3xl font-bold text-verde">{estadisticasGenerales.totalEscuelas}</p>
                    <p className="text-xs md:text-sm text-gray-500">Instituciones</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
                    <CardTitle className="text-sm md:text-lg flex items-center">
                      <Users className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5 text-verde" />
                      Matrícula
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                    <p className="text-xl md:text-3xl font-bold text-verde">
                      {estadisticasGenerales.totalMatricula.toLocaleString()}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">Estudiantes</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
                    <CardTitle className="text-sm md:text-lg flex items-center">
                      <Users className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5 text-verde" />
                      Promedio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                    <p className="text-xl md:text-3xl font-bold text-verde">
                      {estadisticasGenerales.promedioMatricula}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">Por escuela</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-1 md:pb-2 px-3 md:px-6 pt-3 md:pt-6">
                    <CardTitle className="text-sm md:text-lg flex items-center">
                      <Wifi className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5 text-verde" />
                      Departamentos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
                    <p className="text-xl md:text-3xl font-bold text-verde">
                      {estadisticasGenerales.totalDepartamentos}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">Con escuelas</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs para los diferentes gráficos */}
              <Tabs defaultValue="matricula" className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-4 md:mb-6 h-auto">
                  <TabsTrigger value="matricula" className="text-xs md:text-sm py-1.5 md:py-2">
                    Matrícula
                  </TabsTrigger>
                  <TabsTrigger value="categoria" className="text-xs md:text-sm py-1.5 md:py-2">
                    Categorías
                  </TabsTrigger>
                  <TabsTrigger value="edificio" className="text-xs md:text-sm py-1.5 md:py-2">
                    Edificio
                  </TabsTrigger>
                  <TabsTrigger value="internet" className="text-xs md:text-sm py-1.5 md:py-2">
                    Internet
                  </TabsTrigger>
                  <TabsTrigger value="programas" className="text-xs md:text-sm py-1.5 md:py-2">
                    Programas
                  </TabsTrigger>
                  <TabsTrigger value="avance" className="text-xs md:text-sm py-1.5 md:py-2">
                    Avance
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="matricula">
                  <Card>
                    <CardHeader className="pb-2 px-4 md:px-6 pt-4 md:pt-6">
                      <CardTitle className="text-base md:text-lg">Matrícula 2025 por Departamento</CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        Distribución de estudiantes por departamento
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] md:h-[400px] px-2 md:px-6">
                      <MatriculaPorDepartamento escuelas={escuelas} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="categoria">
                  <Card>
                    <CardHeader className="pb-2 px-4 md:px-6 pt-4 md:pt-6">
                      <CardTitle className="text-base md:text-lg">Distribución por Categoría</CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        Cantidad de escuelas según su categoría
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] md:h-[400px] px-2 md:px-6">
                      <EscuelasPorCategoria escuelas={escuelas} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="edificio">
                  <Card>
                    <CardHeader className="pb-2 px-4 md:px-6 pt-4 md:pt-6">
                      <CardTitle className="text-base md:text-lg">Escuelas con Edificio Propio</CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        Proporción de escuelas con edificio propio
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] md:h-[400px] px-2 md:px-6">
                      <EdificioPropio escuelas={escuelas} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="internet">
                  <Card>
                    <CardHeader className="pb-2 px-4 md:px-6 pt-4 md:pt-6">
                      <CardTitle className="text-base md:text-lg">Conectividad a Internet</CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        Tipos de conexión en las instituciones
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] md:h-[400px] px-2 md:px-6">
                      <ConectividadInternet escuelas={escuelas} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="programas">
                  <Card>
                    <CardHeader className="pb-2 px-4 md:px-6 pt-4 md:pt-6">
                      <CardTitle className="text-base md:text-lg">Programas de Acompañamiento</CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        Escuelas con programas de acompañamiento
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] md:h-[400px] px-2 md:px-6">
                      <ProgramasAcompanamiento escuelas={escuelas} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="avance">
                  <Card>
                    <CardHeader className="pb-2 px-4 md:px-6 pt-4 md:pt-6">
                      <CardTitle className="text-base md:text-lg flex items-center">
                        <FileSpreadsheet className="mr-2 h-5 w-5 text-verde" />
                        Avance de Carga por Localidad
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">
                        Comparativa entre escuelas esperadas y cargadas por localidad
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-2 md:px-6">
                      <AvanceLocalidades escuelas={escuelas} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
