"use client"

import { useMemo, useEffect, useState } from "react"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Escuela } from "@/types/iEscuela"

interface ProgramasAcompanamientoProps {
  escuelas: Escuela[]
}

export default function ProgramasAcompanamiento({ escuelas }: ProgramasAcompanamientoProps) {
  const [isMobile, setIsMobile] = useState(false)

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

  // Colores para el gráfico
  const COLORS = ["#3fa038", "#f44336", "#9e9e9e"]

  // Procesar datos para el gráfico
  const data = useMemo(() => {
    // Si hay escuelas, usar datos reales
    if (escuelas && escuelas.length > 0) {
      // Contar escuelas con y sin programas de acompañamiento
      let conProgramas = 0
      let sinProgramas = 0
      let sinDatos = 0

      escuelas.forEach((escuela) => {
        if (escuela.programasAcompañamiento && escuela.programasAcompañamiento.trim() !== "") {
          conProgramas++
        } else if (escuela.programasAcompañamiento === "") {
          sinProgramas++
        } else {
          sinDatos++
        }
      })

      return [
        { name: "Con programas", value: conProgramas },
        { name: "Sin programas", value: sinProgramas },
        { name: "Sin datos", value: sinDatos },
      ]
    }

    // Si no hay escuelas, usar datos ficticios
    return [
      { name: "Con programas", value: 65 },
      { name: "Sin programas", value: 25 },
      { name: "Sin datos", value: 10 },
    ]
  }, [escuelas])

  // Extraer los tipos de programas más comunes
  const programasComunes = useMemo(() => {
    // Si hay escuelas, usar datos reales
    if (escuelas && escuelas.length > 0) {
      const programas: Record<string, number> = {}

      escuelas.forEach((escuela) => {
        if (escuela.programasAcompañamiento && escuela.programasAcompañamiento.trim() !== "") {
          // Dividir por comas o puntos y comas si hay varios programas
          const listaProgamas = escuela.programasAcompañamiento
            .split(/[,;]/)
            .map((p) => p.trim())
            .filter((p) => p !== "")

          listaProgamas.forEach((programa) => {
            if (!programas[programa]) {
              programas[programa] = 0
            }
            programas[programa]++
          })
        }
      })

      // Obtener los 5 programas más comunes
      return Object.entries(programas)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    }

    // Si no hay escuelas, usar datos ficticios
    return [
      { nombre: "Programa de Alfabetización", cantidad: 25 },
      { nombre: "Programa de Inclusión", cantidad: 20 },
      { nombre: "Programa de Educación Rural", cantidad: 15 },
      { nombre: "Programa de Orientación Vocacional", cantidad: 12 },
      { nombre: "Programa de Inclusión Digital", cantidad: 10 },
    ]
  }, [escuelas])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      <div className={isMobile ? "h-[150px]" : "h-[300px]"}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={!isMobile}
              outerRadius={isMobile ? 60 : 100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={isMobile ? undefined : ({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`${value} escuelas`, "Cantidad"]} />
            <Legend
              layout={isMobile ? "horizontal" : "vertical"}
              verticalAlign={isMobile ? "bottom" : "middle"}
              align={isMobile ? "center" : "right"}
              wrapperStyle={{ fontSize: isMobile ? 10 : 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col justify-center">
        <h3 className="text-sm md:text-lg font-semibold mb-2 md:mb-3">Programas más comunes</h3>
        <ul className="space-y-1 md:space-y-2">
          {programasComunes.map((programa, index) => (
            <li key={index} className="flex items-center">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-verde mr-2"></div>
              <span className="text-xs md:text-sm truncate">
                {isMobile && programa.nombre.length > 20 ? programa.nombre.substring(0, 20) + "..." : programa.nombre} (
                {programa.cantidad})
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
