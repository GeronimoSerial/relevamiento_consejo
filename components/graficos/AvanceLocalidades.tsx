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
import { User, Info } from "lucide-react"
import type { Escuela } from "@/types/escuela"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos de escuelas esperadas por localidad
const escuelasEsperadas = {
  "Bella Vista": 35,
  "Berón de Astrada": 6,
  Capital: 86,
  Concepción: 40,
  "Curuzú Cuatiá": 51,
  Empedrado: 40,
  Esquina: 59,
  "Gral. Alvear": 14,
  "Gral. Paz": 34,
  Goya: 95,
  Itatí: 11,
  Ituzaingó: 37,
  Lavalle: 43,
  Mburucuyá: 18,
  Mercedes: 42,
  "Monte Caseros": 39,
  "Paso de los Libres": 33,
  "San Luis del Palmar": 45,
  Saladas: 30,
  "San Cosme": 23,
  "San Martín": 29,
  "San Miguel": 19,
  "San Roque": 29,
  "Santo Tomé": 49,
  Sauce: 20,
}

// Mapeo de supervisores por localidad
const supervisoresPorLocalidad = {
  "Berón de Astrada": ["Virginia Coronel"],
  "San Cosme": ["Virginia Coronel", "Patricia Ponce (Nivel Inicial)"],
  Ituzaingó: ["Virginia Coronel", "Patricia Ponce (Nivel Inicial)"],
  "San Miguel": ["Virginia Coronel", "Patricia Ponce (Nivel Inicial)"],
  "San Roque": ["Sandra Esquivel", "Norma Briend (Nivel Inicial)"],
  Mercedes: ["Gonzales, Milagros", "Claudia Fonseca (Nivel Inicial)"],
  "San Martín": ["Gonzales, Milagros", "Claudia Fonseca (Nivel Inicial)"],
  Esquina: ["Edith Sanchez", "Norma Briend (Nivel Inicial)"],
  Goya: ["Edith Sanchez", "Norma Monzon", "Norma Briend (Nivel Inicial)"],
  "Curuzú Cuatiá": ["Leyes Edid", "Claudia Fonseca (Nivel Inicial)"],
  Sauce: ["Leyes Edid", "Norma Briend (Nivel Inicial)"],
  Capital: [
    "Leyes Edid",
    "Fernandez Juan Carlos",
    "Daniel Alberto Gomez",
    "Monica Beatriz Esquivel",
    "Claudia Fonseca (Nivel Inicial)",
    "Patricia Ponce (Nivel Inicial)",
    "Norma Briend (Nivel Inicial)",
  ],
  "Gral. Alvear": ["Nancy Aguilar Rivero", "Claudia Fonseca (Nivel Inicial)"],
  "Santo Tomé": ["Nancy Aguilar Rivero", "Patricia Ponce (Nivel Inicial)"],
  Concepción: ["Blanca Gutierrez", "Patricia Ponce (Nivel Inicial)"],
  Mburucuyá: ["Blanca Gutierrez", "Patricia Ponce (Nivel Inicial)"],
  "San Luis del Palmar": ["Fernandez Juan Carlos", "Claudia Fonseca (Nivel Inicial)"],
  Itatí: ["Daniel Alberto Gomez", "Patricia Ponce (Nivel Inicial)"],
  Saladas: ["Daniel Alberto Gomez", "Patricia Ponce (Nivel Inicial)"],
  Empedrado: ["Silvia Zabala", "Norma Briend (Nivel Inicial)"],
  "Bella Vista": ["Silvia Zabala", "Norma Briend (Nivel Inicial)"],
  "Gral. Paz": ["Monica Beatriz Esquivel", "Patricia Ponce (Nivel Inicial)"],
  "Paso de los Libres": ["Dora Liliana Peñalber", "Claudia Fonseca (Nivel Inicial)"],
  "Monte Caseros": ["Dora Liliana Peñalber", "Claudia Fonseca (Nivel Inicial)"],
  Lavalle: ["Norma Briend (Nivel Inicial)"],
}

// Lista de todos los supervisores para el filtro
const todosSupervisores = [
  "Virginia Coronel",
  "Sandra Esquivel",
  "Gonzales, Milagros",
  "Edith Sanchez",
  "Leyes Edid",
  "Nancy Aguilar Rivero",
  "Blanca Gutierrez",
  "Fernandez Juan Carlos",
  "Daniel Alberto Gomez",
  "Silvia Zabala",
  "Norma Monzon",
  "Monica Beatriz Esquivel",
  "Dora Liliana Peñalber",
  "Claudia Fonseca (Nivel Inicial)",
  "Patricia Ponce (Nivel Inicial)",
  "Norma Briend (Nivel Inicial)",
]

interface AvanceLocalidadesProps {
  escuelas: Escuela[]
}

export default function AvanceLocalidades({ escuelas }: AvanceLocalidadesProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [filtroLocalidad, setFiltroLocalidad] = useState("")
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

  // Preparar los datos para el gráfico
  const data = useMemo(() => {
    return Object.entries(escuelasEsperadas)
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
      .filter((item) => {
        // Filtrar por localidad si hay un filtro activo
        if (filtroLocalidad && item.localidad !== filtroLocalidad) {
          return false
        }
        // Filtrar por supervisor si hay un filtro activo
        if (filtroSupervisor && !item.supervisores.some((s) => s === filtroSupervisor)) {
          return false
        }
        return true
      })
      .sort((a, b) => {
        // Ordenar por porcentaje de menor a mayor
        return a.porcentaje - b.porcentaje
      })
  }, [escuelasCargadas, filtroLocalidad, filtroSupervisor])

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
    return Object.entries(escuelasEsperadas)
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
      .sort((a, b) => a.localidad.localeCompare(b.localidad))
  }, [escuelasCargadas])

  // Función para mostrar detalles de una localidad
  const mostrarDetallesLocalidad = (localidad: string) => {
    setLocalidadSeleccionada(localidad)
    // Aquí se podría implementar la lógica para mostrar un modal o navegar a otra página
    alert(`Mostrando detalles de ${localidad}`)
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="localidad-select" className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por localidad
          </label>
          <Select value={filtroLocalidad} onValueChange={setFiltroLocalidad}>
            <SelectTrigger id="localidad-select" className="w-full bg-white">
              <SelectValue placeholder="Todas las localidades" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all_localidades">Todas las localidades</SelectItem>
              {Object.keys(escuelasEsperadas)
                .sort()
                .map((localidad) => (
                  <SelectItem key={localidad} value={localidad}>
                    {localidad}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="supervisor-select" className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por supervisor
          </label>
          <Select value={filtroSupervisor} onValueChange={setFiltroSupervisor}>
            <SelectTrigger id="supervisor-select" className="w-full bg-white">
              <SelectValue placeholder="Todos los supervisores" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all_supervisores">Todos los supervisores</SelectItem>
              {todosSupervisores.sort().map((supervisor) => (
                <SelectItem key={supervisor} value={supervisor}>
                  {supervisor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Información de resultados */}
      <div className="text-sm text-gray-600">
        {data.length === 0 ? (
          <p>No se encontraron resultados para los filtros aplicados.</p>
        ) : (
          <p>
            Mostrando {data.length} de {Object.keys(escuelasEsperadas).length} localidades.
          </p>
        )}
      </div>

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

      {/* Nueva subsección: Avance resumido */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Avance resumido por localidad</h3>
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
                        <span className={item.porcentaje === 0 ? "text-red-600 font-medium" : "text-verde font-medium"}>
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
    </div>
  )
}
