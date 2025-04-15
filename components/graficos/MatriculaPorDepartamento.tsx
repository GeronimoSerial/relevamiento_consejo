"use client"

import { useMemo, useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Escuela } from "@/types/escuela"

interface MatriculaPorDepartamentoProps {
  escuelas: Escuela[]
}

export default function MatriculaPorDepartamento({ escuelas }: MatriculaPorDepartamentoProps) {
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

  // Procesar datos para el gráfico
  const data = useMemo(() => {
    // Si hay escuelas, usar datos reales
    if (escuelas && escuelas.length > 0) {
      // Agrupar por departamento y sumar matrículas
      const departamentos = escuelas.reduce(
        (acc, escuela) => {
          const departamento = escuela.departamento
          if (!acc[departamento]) {
            acc[departamento] = 0
          }
          acc[departamento] += Number(escuela.matricula2025) || 0
          return acc
        },
        {} as Record<string, number>,
      )

      // Convertir a array y ordenar por matrícula (descendente)
      return (
        Object.entries(departamentos)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          // Limitar a 7 departamentos en móvil para mejor visualización
          .slice(0, isMobile ? 7 : undefined)
      )
    }

    // Si no hay escuelas, usar datos ficticios
    return [
      { name: "Paraná", value: 4500 },
      { name: "Concordia", value: 3200 },
      { name: "Gualeguaychú", value: 2800 },
      { name: "Diamante", value: 1500 },
      { name: "La Paz", value: 1200 },
      { name: "Federación", value: 950 },
      { name: "Victoria", value: 850 },
    ]
  }, [escuelas, isMobile])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: isMobile ? 60 : 80 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: isMobile ? 10 : 12 }}
          angle={-45}
          textAnchor="end"
          height={isMobile ? 60 : 80}
          interval={0}
        />
        <YAxis
          width={isMobile ? 40 : 80}
          tickFormatter={(value) => (isMobile ? `${Math.round(value / 1000)}k` : `${value.toLocaleString()}`)}
          fontSize={isMobile ? 10 : 12}
        />
        <Tooltip
          formatter={(value: number) => [`${value.toLocaleString()} estudiantes`, "Matrícula"]}
          labelFormatter={(label) => `Departamento: ${label}`}
        />
        <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
        <Bar dataKey="value" name="Matrícula 2025" fill="#3fa038" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
