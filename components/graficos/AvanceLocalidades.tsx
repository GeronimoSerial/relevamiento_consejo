"use client"

import { useState, useMemo, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts"
import { User, Info, AlertCircle } from "lucide-react"
import type { Escuela } from "@/types/escuela"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supervisoresPorLocalidad, todosSupervisores, escuelasEsperadas } from "@/types/escuela"

interface AvanceLocalidadesProps {
  escuelas: Escuela[]
}

export default function AvanceLocalidades({ escuelas }: AvanceLocalidadesProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [filtroSupervisor, setFiltroSupervisor] = useState("")
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState<string | null>(null)

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Comprobar al cargar
    checkIfMobile()

    // Comprobar al cambiar el tamaño de la ventana
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Contar escuelas por departamento desde el JSON
  const escuelasCargadas = useMemo(() => {
    const conteo: Record<string, number> = {}

    // Inicializar todas las localidades con 0
    Object.keys(escuelasEsperadas).forEach((localidad) => {
      conteo[localidad] = 0
    })

    // Contar escuelas por departamento
    escuelas.forEach((escuela) => {
      const departamento = escuela.departamento
      if (departamento in conteo) {
        conteo[departamento]++
      }
    })

    return conteo
  }, [escuelas])

  // Obtener localidades filtradas por supervisor
  const localidadesPorSupervisor = useMemo(() => {
    if (!filtroSupervisor) {
      return Object.keys(supervisoresPorLocalidad)
    }

    return Object.entries(supervisoresPorLocalidad)
      .filter(([_, supervisores]) => supervisores.includes(filtroSupervisor))
      .map(([localidad]) => localidad)
  }, [filtroSupervisor])

  // Preparar los datos para el gráfico
  const data = useMemo(() => {
    // Filtrar localidades por supervisor si hay uno seleccionado
    const localidadesAMostrar = localidadesPorSupervisor

    return Object.entries(escuelasEsperadas)
      .filter(([localidad]) => localidadesAMostrar.includes(localidad))
      .map(([localidad, esperadas]) => {
        const cargadas = escuelasCargadas[localidad] || 0
        const porcentaje = esperadas > 0 ? Math.round((cargadas / esperadas) * 100) : 0
        return {
          localidad,
          esperadas,
          cargadas,
          porcentaje,
          supervisores: supervisoresPorLocalidad[localidad] || [],
        }
      })
      .sort((a, b) => {
        // Ordenar por porcentaje de menor a mayor
        return a.porcentaje - b.porcentaje
      })
  }, [escuelasCargadas, localidadesPorSupervisor])

  // Calcular estadísticas de avance
  const estadisticasAvance = useMemo(() => {
    const totalEscuelasEsperadas = data.reduce((sum, item) => sum + item.esperadas, 0)
    const totalEscuelasCargadas = data.reduce((sum, item) => sum + item.cargadas, 0)
    const porcentajeTotal =
      totalEscuelasEsperadas > 0 ? Math.round((totalEscuelasCargadas / totalEscuelasEsperadas) * 100) : 0

    return {
      totalEscuelasEsperadas,
      totalEscuelasCargadas,
      porcentajeTotal,
      cantidadLocalidades: data.length,
    }
  }, [data])

  // Componente personalizado para el tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200 text-sm">
          <p className="font-bold text-gray-800">{item.localidad}</p>
          <p className="text-verde">
            Cargadas: <span className="font-semibold">{item.cargadas}</span>
          </p>
          <p className="text-gray-600">
            Esperadas: <span className="font-semibold">{item.esperadas}</span>
          </p>
          <p className="text-blue-600">
            Avance: <span className="font-semibold">{item.porcentaje}%</span>
          </p>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="font-semibold text-gray-700">Supervisores:</p>
            <ul className="mt-1 space-y-1">
              {item.supervisores.map((supervisor: string, index: number) => (
                <li key={index} className="flex items-start">
                  <User className="h-3.5 w-3.5 text-gray-500 mr-1 mt-0.5 flex-shrink-0" />
                  <span className="text-xs">{supervisor}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    }
    return null
  }

  // Preparar datos para la lista de resumen
  const resumenLocalidades = useMemo(() => {
    return data.sort((a, b) => b.porcentaje - a.porcentaje)
  }, [data])

  // Función para mostrar detalles de una localidad
  const mostrarDetallesLocalidad = (localidad: string) => {
    setLocalidadSeleccionada(localidad)
    // Aquí se podría implementar la lógica para mostrar un modal o navegar a otra página
    alert(`Mostrando detalles de ${localidad}`)
  }

  return (
    <div className="space-y-6">
      {/* Filtro por supervisor */}
      <div>
        <label htmlFor="supervisor-select" className="block text-sm font-medium text-gray-700 mb-1">
          Filtrar por supervisor
        </label>
        <Select value={filtroSupervisor} onValueChange={(value) => setFiltroSupervisor(value === "all" ? "" : value)}>
          <SelectTrigger id="supervisor-select" className="w-full bg-white">
            <SelectValue placeholder="Todos los supervisores" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Todos los supervisores</SelectItem>
            {todosSupervisores.sort().map((supervisor) => (
              <SelectItem key={supervisor} value={supervisor}>
                {supervisor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Resumen de avance como texto */}
      <div className="bg-verde/5 p-4 rounded-lg border border-verde/20">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Resumen de Avance</h3>

        {data.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm md:text-base">
              <span className="font-medium">Total:</span> {estadisticasAvance.totalEscuelasCargadas} de{" "}
              {estadisticasAvance.totalEscuelasEsperadas} escuelas cargadas ({estadisticasAvance.porcentajeTotal}%)
            </p>
            <p className="text-sm md:text-base">
              <span className="font-medium">Localidades:</span> {estadisticasAvance.cantidadLocalidades}{" "}
              {filtroSupervisor ? `asignadas a ${filtroSupervisor}` : "en total"}
            </p>

            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${estadisticasAvance.porcentajeTotal === 0 ? "bg-red-500" : "bg-verde"}`}
                style={{ width: `${estadisticasAvance.porcentajeTotal}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="flex items-center text-amber-600 bg-amber-50 p-3 rounded-md">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>Sin datos disponibles aún para este supervisor.</p>
          </div>
        )}
      </div>

      {/* Información de resultados */}
      {data.length > 0 ? (
        <>
          {/* Gráfico */}
          <div className="h-[400px] md:h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout={isMobile ? "vertical" : "horizontal"}
                margin={{
                  top: 20,
                  right: 30,
                  left: isMobile ? 100 : 20,
                  bottom: isMobile ? 20 : 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                {isMobile ? (
                  <>
                    <XAxis type="number" />
                    <YAxis dataKey="localidad" type="category" tick={{ fontSize: 10 }} width={100} />
                  </>
                ) : (
                  <>
                    <XAxis
                      dataKey="localidad"
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis />
                  </>
                )}
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar name="Escuelas Esperadas" dataKey="esperadas" fill="#9e9e9e" opacity={0.7} />
                <Bar name="Escuelas Cargadas" dataKey="cargadas" fill="#3fa038">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.porcentaje === 0 ? "#f44336" : "#3fa038"} />
                  ))}
                </Bar>
                <ReferenceLine
                  y={0}
                  stroke="#000"
                  strokeWidth={1}
                  label={isMobile ? null : { value: "Escuelas", position: "insideBottomRight" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Leyenda adicional */}
          <div className="flex flex-wrap gap-4 justify-center text-xs md:text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#9e9e9e] opacity-70 mr-2"></div>
              <span>Escuelas Esperadas</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#3fa038] mr-2"></div>
              <span>Escuelas Cargadas</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#f44336] mr-2"></div>
              <span>Sin Carga (0%)</span>
            </div>
          </div>

          {/* Avance resumido por localidad */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Avance detallado por localidad</h3>
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="max-h-[400px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Localidad
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Supervisores
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Avance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {resumenLocalidades.map((item) => (
                      <tr
                        key={item.localidad}
                        className={`${item.porcentaje === 0 ? "bg-red-50" : ""} hover:bg-gray-50 cursor-pointer`}
                        onClick={() => mostrarDetallesLocalidad(item.localidad)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                          {item.localidad}
                          <Info className="h-4 w-4 ml-2 text-gray-400 hover:text-verde" />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex flex-col space-y-1">
                            {item.supervisores.map((supervisor, idx) => (
                              <span key={idx} className="flex items-center">
                                <User className="h-3.5 w-3.5 text-gray-400 mr-1 flex-shrink-0" />
                                {supervisor}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <span
                              className={item.porcentaje === 0 ? "text-red-600 font-medium" : "text-verde font-medium"}
                            >
                              {item.cargadas} de {item.esperadas} cargadas
                            </span>
                            <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                              {item.porcentaje}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className={`h-1.5 rounded-full ${item.porcentaje === 0 ? "bg-red-500" : "bg-verde"}`}
                              style={{ width: `${item.porcentaje}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Sin datos disponibles</h3>
          <p className="text-gray-600">
            No hay información de escuelas para {filtroSupervisor ? `el supervisor "${filtroSupervisor}"` : "mostrar"}.
          </p>
          {filtroSupervisor && (
            <button
              onClick={() => setFiltroSupervisor("")}
              className="mt-4 px-4 py-2 bg-verde text-white rounded-lg hover:bg-verde/90 transition-colors"
            >
              Ver todos los supervisores
            </button>
          )}
        </div>
      )}
    </div>
  )
}
