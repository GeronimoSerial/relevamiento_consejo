"use client"

import { useMemo, useEffect, useState } from "react"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Escuela } from "@/types/escuela"

interface EscuelasPorCategoriaProps {
  escuelas: Escuela[]
}

export default function EscuelasPorCategoria({ escuelas }: EscuelasPorCategoriaProps) {
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

  // Colores para las diferentes categorías
  const COLORS = ["#3fa038", "#4caf50", "#8bc34a", "#cddc39", "#dce775"]

  // Procesar datos para el gráfico
  const data = useMemo(() => {
    // Si hay escuelas, usar datos reales
    if (escuelas && escuelas.length > 0) {
      // Agrupar por categoría
      const categorias = escuelas.reduce(
        (acc, escuela) => {
          const categoria = escuela.categoria ? `Categoría ${escuela.categoria}` : "Sin categoría"
          if (!acc[categoria]) {
            acc[categoria] = 0
          }
          acc[categoria]++
          return acc
        },
        {} as Record<string, number>,
      )

      // Convertir a array y ordenar por nombre de categoría
      return Object.entries(categorias)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => {
          // Ordenar numéricamente por categoría (1, 2, 3, etc.)
          const numA = Number.parseInt(a.name.replace("Categoría ", ""))
          const numB = Number.parseInt(b.name.replace("Categoría ", ""))
          if (isNaN(numA)) return 1
          if (isNaN(numB)) return -1
          return numA - numB
        })
    }

    // Si no hay escuelas, usar datos ficticios
    return [
      { name: "Categoría 1", value: 25 },
      { name: "Categoría 2", value: 40 },
      { name: "Categoría 3", value: 30 },
      { name: "Sin categoría", value: 5 },
    ]
  }, [escuelas])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={!isMobile}
          outerRadius={isMobile ? 80 : 120}
          innerRadius={isMobile ? 40 : 60}
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
  )
}
